<template>
  <!-- we need at least one element to use lifecycle methods -->
  <div></div>
</template>

<script>
import { addMaxWidth, removeMaxWidth } from "@/utils/ui";

const MOBILE_BREAKPOINT = 600;

export default {
  data() {
    return {
      windowWidth: window.innerWidth,
    };
  },
  methods: {
    handleWindowResize() {
      this.windowWidth = window.innerWidth;
    },
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.handleWindowResize);
    });

    window.setTimeout(() => {
      if (this.windowWidth < MOBILE_BREAKPOINT && this.$refs.itemContainer)
        addMaxWidth(this.$refs.itemContainer);
    }, 1000);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleWindowResize);
  },
  watch: {
    windowWidth(newWidth, oldWidth) {
      if (!this.$refs.itemContainer) return;

      if (oldWidth > MOBILE_BREAKPOINT && newWidth < MOBILE_BREAKPOINT) {
        addMaxWidth(this.$refs.itemContainer);
      }

      if (oldWidth < MOBILE_BREAKPOINT && newWidth > MOBILE_BREAKPOINT) {
        removeMaxWidth(this.$refs.itemContainer);
      }
    },
  },
};
</script>
