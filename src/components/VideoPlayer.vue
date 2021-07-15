<template>
  <div class="video-container">
    <div class="video-wrapper">
      <iframe
        width="560"
        height="315"
        :src="url"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</template>

<script>
export default {
  name: "VideoPlayer",
  props: {
    url: {
      type: String,
      required: true,
    },
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
