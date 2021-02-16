<template>
  <div>
    <div v-if="isLoading"><FeedItemSkeleton /></div>
    <h2 v-else-if="error">{{ error }}</h2>
    <div v-else>
      <button class="btn" @click="toggleReadStatus()">
        {{ item.isRead ? "Mark as unread" : "Mark as read" }}
      </button>

      <h2 class="title">{{ item.title }}</h2>

      <div class="description" ref="description">
        <div v-if="!!item.description">
          <div v-if="item.mediaType === 'audio/mpeg'">
            <button class="btn" @click="handlePlaybackRateChange">
              {{ playbackRate + "x" }}
            </button>

            <figure>
              <audio
                ref="audioRef"
                controls
                :src="item.mediaUrl"
                preload="auto"
              >
                Your browser does not support the
                <code>audio</code> element.
              </audio>
              <figcaption>{{ item.description }}</figcaption>
            </figure>
          </div>
          <div v-else v-html="item.description"></div>
        </div>
        <div class="video-container" v-else-if="item.youtubeEmbedUrl">
          <div class="video-wrapper">
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
  </div>
</template>

<script>
import { mapState } from "vuex";
import { get, put } from "@/utils/api";
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
  name: "FeedItemPage",
  components: { FeedItemSkeleton },
  data() {
    return {
      item: {},
      isLoading: false,
      error: "",
      windowWidth: window.innerWidth,
      playbackRate: 1
    };
  },
  computed: {
    ...mapState(["isAuthenticated", "authToken"])
  },
  methods: {
    toggleReadStatus() {
      const newIsReadStatus = !this.item.isRead;

      put("/item", {
        items: [{ id: this.item.id, isRead: newIsReadStatus }]
      })
        .then(() => {
          this.item.isRead = newIsReadStatus;
        })
        .catch(() => {
          this.error = "There was an error updating the status of this item";
        });
    },
    handleWindowResize() {
      this.windowWidth = window.innerWidth;
    },
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
audio {
  border: 3px solid darkgray;
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

.title {
  margin: 0 2rem;
}

.description {
  padding: 3rem;
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

/* Tablet */
@media (max-width: 48em) {
  audio {
    width: 100%;
  }
}

/* Mobile */
@media (max-width: 37.5em) {
  .description {
    margin: 3rem auto;
    padding: 0;
  }
}
</style>
