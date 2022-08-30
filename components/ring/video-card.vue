<script setup>
useHead({
  script: [{ src: "https://vjs.zencdn.net/7.20.2/video.min.js", body: true }],
  link: [
    { rel: "stylesheet", href: "https://vjs.zencdn.net/7.20.2/video-js.css" },
  ],
});
onMounted(async () => {
  const player = videojs("video");
  player.play();
});
</script>
<template>
  <a
    class="gradient-border cursor-pointer col-span-3 sm:col-span-1 p-4 flex flex-col"
  >
    <video
      id="video"
      class="videojs"
      controls
      preload="auto"
      autoplay
      width="400"
    >
      <source src="output/stream.m3u8" type="application/x-mpegURL" />
      Your browser does not support HTML5 video.
    </video>
  </a>
</template>
