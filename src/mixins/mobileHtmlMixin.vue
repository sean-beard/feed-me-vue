<template>
  <!-- we need at least one element to use lifecycle methods -->
  <div></div>
</template>

<script>
import { addMaxWidth, removeMaxWidth } from "@/utils/ui";

const MOBILE_BREAKPOINT = 600;

const styleCodeSnippets = isMobileScreen => {
  document.querySelectorAll("pre").forEach(el => {
    el.style.textAlign = "left";
    el.style.width = isMobileScreen ? "300px" : "450px";
    el.style.margin = isMobileScreen ? "0" : "0 auto";
  });
};

export default {
  data() {
    return {
      windowWidth: window.innerWidth
    };
  },
  methods: {
    handleWindowResize() {
      this.windowWidth = window.innerWidth;
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.handleWindowResize);
    });

    window.setTimeout(() => {
      const isMobileScreen = this.windowWidth < MOBILE_BREAKPOINT;

      if (this.$refs.description) {
        styleCodeSnippets(isMobileScreen);

        if (isMobileScreen) addMaxWidth(this.$refs.description);
      }
    }, 1000);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleWindowResize);
  },
  watch: {
    windowWidth(newWidth, oldWidth) {
      if (!this.$refs.description) return;

      const wasMobileScreen = oldWidth < MOBILE_BREAKPOINT;
      const isMobileScreen = newWidth < MOBILE_BREAKPOINT;

      if (!wasMobileScreen && isMobileScreen) {
        styleCodeSnippets(isMobileScreen);
        addMaxWidth(this.$refs.description);
      }

      if (wasMobileScreen && !isMobileScreen) {
        styleCodeSnippets(isMobileScreen);
        removeMaxWidth(this.$refs.description);
      }
    }
  }
};
</script>
