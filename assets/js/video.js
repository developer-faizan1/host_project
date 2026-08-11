const videos = [
  "./assets/videos/herov.mp4",
  "./assets/videos/herov2.mp4",
];

let current = 0;

let currentVideo = document.getElementById("video1");
let nextVideo = document.getElementById("video2");

currentVideo.src = videos[current];
currentVideo.play();

currentVideo.addEventListener("ended", switchVideo);

function switchVideo() {
  current++;

  if (current >= videos.length) {
    current = 0;
  }

  nextVideo.src = videos[current];
  nextVideo.load();

  nextVideo.oncanplay = () => {
    nextVideo.play();

    nextVideo.classList.add("active");
    currentVideo.classList.remove("active");

    [currentVideo, nextVideo] = [nextVideo, currentVideo];

    currentVideo.onended = switchVideo;
  };
}