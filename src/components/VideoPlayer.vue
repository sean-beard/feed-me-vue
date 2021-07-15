<template>
  <div>
    <button class="btn" @click="handlePlaybackRateChange" type="button">
      {{ playbackRate + "x" }}
    </button>

    <div class="video-container">
      <div class="video-wrapper">
        <div id="player"></div>
      </div>
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
  data() {
    return { player: null, playbackRate: 1 };
  },
  methods: {
    loadPlayer(YT) {
      const videoId = this.videoId;

      this.player = new YT.Player("player", {
        height: "315",
        width: "560",
        videoId,
      });
    },
    handlePlaybackRateChange() {
      switch (this.playbackRate) {
        case 1:
          this.playbackRate = 1.5;
          break;
        case 1.5:
          this.playbackRate = 2;
          break;
        case 2:
          this.playbackRate = 1;
          break;
        default:
          this.playbackRate = 1;
      }

      this.player && this.player.setPlaybackRate(this.playbackRate);
    },
  },
  mounted() {
    YouTubeIframeLoader.load(this.loadPlayer);
  },
};
</script>

<style scoped>
.btn {
  margin-bottom: 1rem;
  min-width: 100px;
}

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
