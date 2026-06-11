import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { memories } from "./memories.js";
import { openMemoryDoor } from "./gallery.js";

const BASE = import.meta.env.BASE_URL;

const canvas = document.getElementById("world");
const title = document.getElementById("memory-title");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(0, 1.2, 9);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 3, 20);
pointLight.position.set(0, 4, 4);
scene.add(pointLight);

const loader = new GLTFLoader();

let lilies = [];
let currentIndex = 0;
let startX = 0;
let startY = 0;

const pond = new THREE.Mesh(
  new THREE.CircleGeometry(8, 64),
  new THREE.MeshStandardMaterial({
    color: 0x172033,
    roughness: 0.2,
    metalness: 0.3
  })
);

pond.rotation.x = -Math.PI / 2;
pond.position.y = -1.2;
scene.add(pond);

function createFallbackLily(memory, index) {
  const group = new THREE.Group();

  const petals = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 16),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(memory.glow),
      emissive: new THREE.Color(memory.glow),
      emissiveIntensity: 0.18
    })
  );

  petals.scale.set(1.2, 0.28, 1.2);
  group.add(petals);

  const center = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 24, 16),
    new THREE.MeshStandardMaterial({
      color: 0xffe066,
      emissive: 0xffd35a,
      emissiveIntensity: 0.4
    })
  );

  center.position.y = 0.18;
  group.add(center);

  group.userData = { memory, index };
  scene.add(group);
  lilies[index] = group;
}

function loadLilies() {
  memories.forEach((memory, index) => {
    loader.load(
      `${BASE}models/lily.glb`,
      gltf => {
        const lily = gltf.scene;
        lily.userData = { memory, index };
        scene.add(lily);
        lilies[index] = lily;
        updateCarousel();
      },
      undefined,
      () => {
        createFallbackLily(memory, index);
        updateCarousel();
      }
    );
  });
}

function updateCarousel() {
  const memory = memories[currentIndex];
  title.textContent = memory.title;

  document.body.style.background = `
    radial-gradient(circle at 50% 8%, rgba(255,255,255,0.9), transparent 24%),
    radial-gradient(circle at 78% 18%, ${memory.theme}88, transparent 30%),
    linear-gradient(180deg, #fff8ee 0%, ${memory.theme}66 48%, #eaf7e8 100%)
  `;

  lilies.forEach((lily, index) => {
    if (!lily) return;

    const offset = index - currentIndex;

    lily.position.x = offset * 3;
    lily.position.y = offset === 0 ? 0 : -0.35;
    lily.position.z = Math.abs(offset) * -1.7;

    const scale = offset === 0 ? 0.15: 0.15;
    lily.scale.set(scale, scale, scale);

    lily.rotation.y = offset * 0.45;
    lily.visible = Math.abs(offset) <= 2;
  });
}

function nextLily() {
  currentIndex = (currentIndex + 1) % memories.length;
  updateCarousel();
}

function prevLily() {
  currentIndex = (currentIndex - 1 + memories.length) % memories.length;
  updateCarousel();
}

window.addEventListener("pointerdown", event => {
  if (event.target.closest("#gallery, #memory-door")) return;

  startX = event.clientX;
  startY = event.clientY;
});

window.addEventListener("pointerup", event => {
  if (event.target.closest("#gallery, #memory-door")) return;

  const diffX = event.clientX - startX;
  const diffY = event.clientY - startY;

  if (Math.abs(diffX) > 55 && Math.abs(diffX) > Math.abs(diffY)) {
    diffX < 0 ? nextLily() : prevLily();
  } else {
    openMemoryDoor(memories[currentIndex]);
  }
});

function animate() {
  requestAnimationFrame(animate);

  lilies.forEach((lily, index) => {
    if (!lily) return;

    lily.rotation.y += 0.004;
    lily.position.y += Math.sin(Date.now() * 0.0015 + index) * 0.0008;
  });

  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});

loadLilies();
animate();