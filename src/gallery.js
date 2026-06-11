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

export function openMemoryDoor(memory) {
  currentMemory = memory;
  photoIndex = 0;

  doorTitle.textContent = memory.title;
  blurBg.style.backgroundImage = `url(${memory.photos[0]})`;
  door.classList.remove("hidden");
}

enterBtn.addEventListener("click", () => {
  if (!currentMemory) return;

  door.classList.add("hidden");
  gallery.classList.remove("hidden");

  playRandomSpotifySong();
  showPhoto();
});

function showPhoto() {
  galleryImg.src = currentMemory.photos[photoIndex];
  galleryCaption.textContent = `${currentMemory.title} — ${photoIndex + 1}/${currentMemory.photos.length}`;
}

prevPhoto.addEventListener("click", () => {
  photoIndex =
    (photoIndex - 1 + currentMemory.photos.length) % currentMemory.photos.length;
  showPhoto();
});

nextPhoto.addEventListener("click", () => {
  photoIndex = (photoIndex + 1) % currentMemory.photos.length;
  showPhoto();
});

closeGallery.addEventListener("click", () => {
  gallery.classList.add("hidden");
  stopMusic();
});