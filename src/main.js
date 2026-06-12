import "./style.css";
import { memories } from "./memories.js";
import { openMemoryDoor } from "./gallery.js";

const title = document.getElementById("memory-title");
const lilyStage = document.getElementById("lily-stage");

const centerButton = document.getElementById("center-lily-button");
const centerLily = document.getElementById("center-lily");
const leftLily = document.getElementById("left-lily");
const rightLily = document.getElementById("right-lily");

let currentIndex = 0;
let startX = 0;
let startY = 0;

const lilyExtensions = ["png", "jpg", "jpeg", "webp"];

function hexToRgba(hex, alpha) {
  const clean = hex.replace("#", "");
  const value = parseInt(clean, 16);

  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getIndex(index) {
  return (index + memories.length) % memories.length;
}

function setLilyImage(img, memory) {
  let attempt = 0;

  img.style.display = "block";
  img.alt = memory.title;

  img.onerror = () => {
    attempt += 1;

    if (attempt < lilyExtensions.length) {
      img.src = `${memory.lilyBase}.${lilyExtensions[attempt]}`;
    } else {
      img.style.display = "none";
    }
  };

  img.src = `${memory.lilyBase}.${lilyExtensions[0]}`;
}

function applyTheme(memory) {
  document.body.style.setProperty("--theme", memory.theme);
  document.body.style.setProperty("--theme-soft", memory.soft);
  document.body.style.setProperty("--theme-deep", memory.deep);
  document.body.style.setProperty("--theme-glow", hexToRgba(memory.theme, 0.38));
  document.body.style.setProperty("--theme-wash", hexToRgba(memory.theme, 0.18));
}

function updateCarousel(direction = "none") {
  const memory = memories[currentIndex];
  const previous = memories[getIndex(currentIndex - 1)];
  const next = memories[getIndex(currentIndex + 1)];

  title.textContent = memory.title;
  applyTheme(memory);

  setLilyImage(centerLily, memory);
  setLilyImage(leftLily, previous);
  setLilyImage(rightLily, next);

  lilyStage.classList.remove("move-left", "move-right");
  void lilyStage.offsetWidth;

  if (direction === "next") {
    lilyStage.classList.add("move-left");
  }

  if (direction === "prev") {
    lilyStage.classList.add("move-right");
  }
}

function nextLily() {
  currentIndex = getIndex(currentIndex + 1);
  updateCarousel("next");
}

function prevLily() {
  currentIndex = getIndex(currentIndex - 1);
  updateCarousel("prev");
}

centerButton.addEventListener("click", event => {
  event.stopPropagation();
  openMemoryDoor(memories[currentIndex]);
});

leftLily.addEventListener("click", event => {
  event.stopPropagation();
  prevLily();
});

rightLily.addEventListener("click", event => {
  event.stopPropagation();
  nextLily();
});

lilyStage.addEventListener("pointerdown", event => {
  startX = event.clientX;
  startY = event.clientY;
});

lilyStage.addEventListener("pointerup", event => {
  const diffX = event.clientX - startX;
  const diffY = event.clientY - startY;

  if (Math.abs(diffX) > 55 && Math.abs(diffX) > Math.abs(diffY)) {
    diffX < 0 ? nextLily() : prevLily();
  }
});

window.addEventListener("keydown", event => {
  if (event.key === "ArrowRight") nextLily();
  if (event.key === "ArrowLeft") prevLily();
  if (event.key === "Enter") openMemoryDoor(memories[currentIndex]);
});

updateCarousel();