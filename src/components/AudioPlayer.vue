<template>
  <div>
    <button class="btn" @click="handlePlaybackRateChange">
      {{ playbackRate + "x" }}
    </button>

    <figure>
      <audio ref="audioRef" controls :src="url" preload="auto">
        Your browser does not support the
        <code>audio</code> element.
      </audio>
      <figcaption>{{ description }}</figcaption>
    </figure>
  </div>
</template>

<script>
export default {
  name: "AudioPlayer",
  props: {
    url: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      playbackRate: 1
    };
  },
  methods: {
    handlePlaybackRateChange() {
      const audioElement = this.$refs.audioRef;

      if (!audioElement) return;

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

      audioElement.playbackRate = this.playbackRate;
    }
  }
};
</script>

<style scoped>
audio {
  border: 3px solid darkgray;
  background-color: darkgray;
  margin-bottom: 3rem;
  width: 75%;
  max-width: 1280px;
}

audio:focus {
  border: 3px solid #1a237e;
}

.btn {
  margin: 2rem 0 4rem 0;
  min-width: 100px;
}

/* Tablet */
@media (max-width: 48em) {
  audio {
    border: none;
    background-color: transparent;
    width: 100%;
  }
}
</style>
