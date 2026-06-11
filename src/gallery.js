import { playRandomSpotifySong, stopMusic } from "./audio.js";

const door = document.getElementById("memory-door");
const blurBg = document.getElementById("blur-bg");
const doorTitle = document.getElementById("door-title");
const enterBtn = document.getElementById("enter-memory");

const gallery = document.getElementById("gallery");
const galleryImg = document.getElementById("gallery-img");
const galleryCaption = document.getElementById("gallery-caption");
const closeGallery = document.getElementById("close-gallery");
const prevPhoto = document.getElementById("prev-photo");
const nextPhoto = document.getElementById("next-photo");

let currentMemory = null;
let photoIndex = 0;
let startX = 0;
let startY = 0;

export function openMemoryDoor(memory) {
  currentMemory = memory;
  photoIndex = 0;

  doorTitle.textContent = memory.title;
  blurBg.style.backgroundImage = `url("${memory.photos[0]}")`;
  door.classList.remove("hidden");
}

enterBtn.addEventListener("click", event => {
  event.stopPropagation();

  if (!currentMemory) return;

  door.classList.add("hidden");
  gallery.classList.remove("hidden");

  playRandomSpotifySong();
  showPhoto();
});

function showPhoto(direction = "next") {
  if (!currentMemory) return;

  galleryImg.classList.remove("slide-left", "slide-right");
  void galleryImg.offsetWidth;

  galleryImg.src = currentMemory.photos[photoIndex];
  galleryImg.classList.add(direction === "next" ? "slide-left" : "slide-right");

  galleryCaption.textContent = `${currentMemory.title} — ${photoIndex + 1}/${currentMemory.photos.length}`;
}

function goNext() {
  photoIndex = (photoIndex + 1) % currentMemory.photos.length;
  showPhoto("next");
}

function goPrev() {
  photoIndex =
    (photoIndex - 1 + currentMemory.photos.length) % currentMemory.photos.length;
  showPhoto("prev");
}

prevPhoto.addEventListener("click", event => {
  event.stopPropagation();
  goPrev();
});

nextPhoto.addEventListener("click", event => {
  event.stopPropagation();
  goNext();
});

closeGallery.addEventListener("click", event => {
  event.stopPropagation();
  gallery.classList.add("hidden");
  stopMusic();
});

gallery.addEventListener("pointerdown", event => {
  startX = event.clientX;
  startY = event.clientY;
});

gallery.addEventListener("pointerup", event => {
  const diffX = event.clientX - startX;
  const diffY = event.clientY - startY;

  if (Math.abs(diffX) > 55 && Math.abs(diffX) > Math.abs(diffY)) {
    diffX < 0 ? goNext() : goPrev();
  }
});