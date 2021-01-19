<template>
  <div>
    <div v-if="isLoading"><FeedItemSkeleton /></div>
    <h2 v-else-if="error">{{ error }}</h2>
    <div v-else>
      <button class="btn" @click="toggleReadStatus()">
        {{ item.isRead ? "Mark as unread" : "Mark as read" }}
      </button>

      <div ref="description">
        <div v-if="!!item.description" v-html="item.description"></div>
        <div v-else-if="item.youtubeEmbedUrl">
          <iframe
            width="560"
            height="315"
            :src="item.youtubeEmbedUrl"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { get, post } from "@/utils/api";
import FeedItemSkeleton from "@/components/FeedItemSkeleton.vue";

const MOBILE_BREAKPOINT = 600;
const MAX_MOBILE_WIDTH = "90vw";

function addMaxWidth(el) {
  el.style.maxWidth = MAX_MOBILE_WIDTH;

  (el.childNodes || []).forEach(x => {
    if (x.nodeType == 1) addMaxWidth(x);
  });
}

function removeMaxWidth(el) {
  if (el.style.maxWidth !== MAX_MOBILE_WIDTH) return;

  el.style.maxWidth = "unset";

  (el.childNodes || []).forEach(x => {
    if (x.nodeType == 1) removeMaxWidth(x);
  });
}

function getParameterByName(url, name) {
  const match = RegExp("[?&]" + name + "=([^&]*)").exec(url);
  return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}

export default {
  name: "FeedItem",
  components: { FeedItemSkeleton },
  data() {
    return {
      item: {},
      isLoading: false,
      error: "",
      windowWidth: window.innerWidth
    };
  },
  computed: {
    ...mapState(["isAuthenticated", "authToken"])
  },
  methods: {
    toggleReadStatus() {
      post("/item", { id: this.item.id, isRead: !this.item.isRead }).then(
        ({ status, isRead }) => {
          if (status === 500) {
            this.error = "There was an error updating the status of this item";
            return;
          }

          this.item.isRead = isRead;
        }
      );
    },
    handleWindowResize() {
      this.windowWidth = window.innerWidth;
    }
  },
  created() {
    if (!this.isAuthenticated) {
      this.error = "Oops! You must be logged in to do that";
      return;
    }
  },
  mounted() {
    this.isLoading = true;

    get(`/item/${this.$route.params.id}`)
      .then(({ status, item }) => {
        if (status === 500) {
          this.error = "There was an error loading this feed item";
          return;
        }

        if (item.url && item.url.indexOf("youtube.com")) {
          const embedUrlBase = "https://www.youtube.com/embed";
          const videoId = getParameterByName(item.url, "v");
          item.youtubeEmbedUrl = `${embedUrlBase}/${videoId}`;
        }

        this.item = item;
      })
      .finally(() => {
        this.isLoading = false;
      });

    this.$nextTick(() => {
      window.addEventListener("resize", this.handleWindowResize);
    });

    window.setTimeout(() => {
      if (this.windowWidth < MOBILE_BREAKPOINT && this.$refs.description)
        addMaxWidth(this.$refs.description);
    }, 1000);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleWindowResize);
  },
  watch: {
    windowWidth(newWidth, oldWidth) {
      if (!this.$refs.description) return;

      if (oldWidth > MOBILE_BREAKPOINT && newWidth < MOBILE_BREAKPOINT) {
        addMaxWidth(this.$refs.description);
      }

      if (oldWidth < MOBILE_BREAKPOINT && newWidth > MOBILE_BREAKPOINT) {
        removeMaxWidth(this.$refs.description);
      }
    }
  }
};
</script>

<style scoped>
.btn {
  margin: 2rem 0;
}
</style>
