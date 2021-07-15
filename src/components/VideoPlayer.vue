<template>
  <div class="video-container">
    <div class="video-wrapper">
      <div id="player"></div>
    </div>
  </div>
</template>

<script>
import YouTubeIframeLoader from "youtube-iframe";

export default {
  name: "VideoPlayer",
  props: {
    videoId: {
      type: String,
      required: true,
    },
  },
  mounted() {
    const videoId = this.videoId;

    YouTubeIframeLoader.load(function(YT) {
      new YT.Player("player", {
        height: "315",
        width: "560",
        videoId,
      });
    });
  },
};
</script>

<style scoped>
/* Tablet + Desktop */
@media (min-width: 37.5em) {
  .video-container {
    width: 80%;
    max-width: 1280px;
    margin: 3rem auto;
  }

  .video-wrapper {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 */
    height: 0;
  }

  .video-wrapper iframe,
  .video-wrapper embed,
  .video-wrapper object {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
