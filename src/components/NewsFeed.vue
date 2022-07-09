<template>
  <div>
    <form>
      <div>
        <div class="toggles">
          <label>
            <input type="checkbox" :value="true" v-model="localShowArticles" />
            <span>Articles</span>
          </label>
          <label>
            <input type="checkbox" :value="true" v-model="localShowPodcasts" />
            <span>Podcasts</span>
          </label>
          <label>
            <input
              type="checkbox"
              :value="true"
              v-model="localShowYouTubeVideos"
            />
            <span>YouTube</span>
          </label>
        </div>

        <div class="input-field">
          <label for="search">{{
            `Search ${localShouldFilterUnread ? "unread" : "all"}`
          }}</label>
          <input id="search" type="search" v-model="localSearchTerm" />

          <button
            v-if="localSearchTerm"
            class="clear-search-btn"
            type="button"
            @click.prevent="localSearchTerm = ''"
          >
            <span class="visually-hidden">Clear search text</span>
            <i class="material-icons">close</i>
          </button>
        </div>
      </div>
    </form>

    <div class="controls">
      <div class="status-controls">
        <label v-if="renderedItems.length && !loading">
          <input type="checkbox" :value="true" v-model="areAllChecked" />
          <span class="visually-hidden">Select all items</span>
        </label>

        <div class="btn-wrapper" v-if="checkedItemIds.length">
          <button
            class="btn"
            :disabled="isLoading"
            @click="handleMarkAll('read')"
          >
            Mark as Read
          </button>
          <button
            class="btn"
            :disabled="isLoading"
            @click="handleMarkAll('unread')"
          >
            Mark as Unread
          </button>
        </div>
      </div>

      <label class="desktop-filter">
        <input
          type="checkbox"
          :value="true"
          v-model="localShouldFilterUnread"
        />
        <span>Filter by unread</span>
      </label>

      <label
        class="btn mobile-filter"
        :class="
          localShouldFilterUnread ? 'mobile-filtered' : 'mobile-unfiltered'
        "
      >
        <input
          type="checkbox"
          class="visually-hidden"
          :value="true"
          v-model="localShouldFilterUnread"
        />
        <span class="visually-hidden">Filter by unread</span>
        <i class="material-icons">filter_list</i>
      </label>
    </div>

    <transition-group name="transition-list">
      <div class="feed-row" v-for="item in renderedItems" :key="item.id">
        <label>
          <input type="checkbox" :value="item.id" v-model="checkedItemIds" />
          <span class="visually-hidden">{{ item.title }}</span>
        </label>
        <FeedItemCard class="full" :item="item" />
      </div>
    </transition-group>

    <h2 v-if="!renderedItems.length">
      Nothing to see here!
    </h2>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { put } from "@/utils/api";
import { NUM_CACHED_FEED_ITEMS } from "@/utils/ui";
import FeedItemCard from "./FeedItemCard";

export default {
  name: "NewsFeed",
  components: {
    FeedItemCard,
  },
  props: {
    items: Array,
    loading: Boolean,
  },
  data() {
    return {
      areAllChecked: false,
      checkedItemIds: [],
      isLoading: false,
      localShouldFilterUnread: true,
      localShowArticles: true,
      localShowPodcasts: true,
      localShowYouTubeVideos: true,
      localSearchTerm: "",
    };
  },
  computed: {
    ...mapState(["newsFeed"]),
    unreadItems() {
      return this.items.filter(item => !item.isRead);
    },
    renderedItems() {
      const items = this.localShouldFilterUnread
        ? this.unreadItems
        : this.items;

      const searchedItems = this.getSearchedItems(items);

      return this.getFilteredItems(searchedItems);
    },
  },
  methods: {
    ...mapActions(["setNewsFeed"]),
    getSearchedItems(items) {
      if (!this.localSearchTerm) return items;

      const term = this.localSearchTerm.toLowerCase();

      return items.filter(
        item =>
          item.title.toLowerCase().indexOf(term) > -1 ||
          item.feedName.toLowerCase().indexOf(term) > -1 ||
          (item.description || "").toLowerCase().indexOf(term) > -1,
      );
    },
    getFilteredItems(items) {
      let filteredItems = items;

      if (!this.localShowArticles) {
        filteredItems = filteredItems.filter(item => {
          if (
            item.mediaType === "audio/mpeg" ||
            item.url.indexOf("youtube.com") > 0
          ) {
            return true;
          }

          return false;
        });
      }

      if (!this.localShowPodcasts) {
        filteredItems = filteredItems.filter(
          item => item.mediaType !== "audio/mpeg",
        );
      }

      if (!this.localShowYouTubeVideos) {
        filteredItems = filteredItems.filter(item => {
          if (!item.url) {
            return true;
          }

          return item.url.indexOf("youtube.com") < 0;
        });
      }

      return filteredItems;
    },
    handleMarkAll(status) {
      const newIsReadStatus = status === "read";
      const payload = this.checkedItemIds.map(id => ({
        id: id,
        isRead: newIsReadStatus,
      }));

      this.isLoading = true;

      // TODO: catch/handle error
      put("/item", { items: payload })
        .then(({ status }) => {
          if (status !== 200) {
            // TODO: catch/handle error
            return;
          }

          // TODO: don't mutate prop
          this.items = this.items.map(item => {
            if (this.checkedItemIds.indexOf(item.id) < 0) {
              return item;
            }

            return {
              ...item,
              isRead: newIsReadStatus,
            };
          });

          this.areAllChecked = false;
          this.checkedItemIds = [];
          localStorage.setItem(
            "feed",
            JSON.stringify(this.items.slice(0, NUM_CACHED_FEED_ITEMS)),
          );
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    syncLocalStateToGlobalStore() {
      const newsFeed = {
        searchTerm: this.localSearchTerm,
        showArticles: this.localShowArticles,
        showPodcasts: this.localShowPodcasts,
        showYouTubeVideos: this.localShowYouTubeVideos,
        shouldFilterUnread: this.localShouldFilterUnread,
      };

      this.setNewsFeed(newsFeed);
    },
  },
  watch: {
    areAllChecked(selectEverything) {
      this.checkedItemIds = selectEverything
        ? this.renderedItems.map(item => item.id)
        : [];
    },
  },
  mounted() {
    window.addEventListener("beforeunload", this.syncLocalStateToGlobalStore);

    if (this.newsFeed.searchTerm) {
      document.getElementById("search").focus();
    }

    this.localSearchTerm = this.newsFeed.searchTerm;
    this.localShowArticles = this.newsFeed.showArticles;
    this.localShowPodcasts = this.newsFeed.showPodcasts;
    this.localShowYouTubeVideos = this.newsFeed.showYouTubeVideos;
    this.localShouldFilterUnread = this.newsFeed.shouldFilterUnread;
  },
  beforeDestroy() {
    this.syncLocalStateToGlobalStore();

    window.removeEventListener(
      "beforeunload",
      this.syncLocalStateToGlobalStore,
    );
  },
};
</script>

<style scoped>
form {
  display: flex;
  justify-content: center;
}

label[for="search"],
input[type="search"] {
  padding-left: 0.5rem;
}

input[type="search"] {
  width: 350px;
}

button + button {
  margin-left: 1rem;
}

.clear-search-btn {
  background: none;
  border: none;
  cursor: pointer;
  height: 40px;
  margin-top: 0.25rem;
  margin-left: -2.5rem;
  z-index: 10;
}

.toggles {
  display: flex;
  margin-bottom: 2rem;
  justify-content: space-between;
}

.controls,
.feed-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem auto;
  width: 80%;
  max-width: 750px;
  min-height: 4.5rem;
}

.feed-row {
  justify-content: center;
}

.status-controls {
  display: flex;
  align-items: center;
  flex: 1;
}

.input-field {
  display: flex;
}

.full {
  flex: 1;
}

.desktop-filter {
  margin-left: 1rem;
}

.mobile-filter {
  display: none;
}

.visually-hidden,
.mobile-filter [type="checkbox"] + span:not(.lever) {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  border: 0;
  padding: 0;
  clip: rect(0 0 0 0);
  overflow: hidden;
}

.btn.mobile-filtered,
.btn.mobile-filtered,
.btn.mobile-filtered:hover,
.btn.mobile-filtered:focus {
  background-color: #1a237e;
  color: white;
}

.btn.mobile-unfiltered,
.btn.mobile-unfiltered,
.btn.mobile-unfiltered:hover,
.btn.mobile-unfiltered:focus {
  background-color: white;
  color: #1a237e;
}

[type="checkbox"] + span:not(.lever) {
  color: #1a237e;
  font-weight: bold;
}

[type="checkbox"]:checked + span:not(.lever)::before {
  border-right-color: #1a237e;
  border-bottom-color: #1a237e;
}

.transition-list-enter-active,
.transition-list-leave-active {
  transition: all 0.25s;
}

.transition-list-enter,
.transition-list-leave-to {
  opacity: 0;
  transform: translateY(-16px);
}

/* Mobile */
@media (max-width: 37.5em) {
  button + button {
    margin-left: 0;
    margin-top: 1rem;
  }

  .btn-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
  }

  .controls,
  .feed-row {
    min-height: 6rem;
  }

  .desktop-filter {
    display: none;
  }

  .mobile-filter {
    display: block;
  }
}
</style>
