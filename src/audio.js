import { spotifySongs } from "./memories.js";

const spotifyPlayer = document.getElementById("spotify-player");
const spotifyFrame = document.getElementById("spotify-frame");

export function playRandomSpotifySong() {
  const randomSong =
    spotifySongs[Math.floor(Math.random() * spotifySongs.length)];

  spotifyFrame.src = randomSong;
  spotifyPlayer.classList.remove("hidden");
}

export function stopMusic() {
  spotifyFrame.src = "";
  spotifyPlayer.classList.add("hidden");
}