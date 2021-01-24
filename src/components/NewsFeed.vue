<template>
  <div>
    <div class="controls">
      <div class="status-controls">
        <label>
          <input type="checkbox" :value="true" v-model="areAllChecked" />
          <span class="visually-hidden">Select all items</span>
        </label>

        <div class="btn-wrapper" v-if="checkedItemIds.length">
          <button class="btn" @click="handleMarkAll('read')">
            Mark as Read
          </button>
          <button class="btn" @click="handleMarkAll('unread')">
            Mark as Unread
          </button>
        </div>
      </div>

      <div v-if="filteredItems.length !== items.length">
        <label class="desktop-filter">
          <input type="checkbox" :value="true" v-model="shouldFilterUnread" />
          <span>Filter by unread</span>
        </label>

        <label
          class="btn mobile-filter"
          :class="shouldFilterUnread ? 'mobile-filtered' : 'mobile-unfiltered'"
        >
          <input
            type="checkbox"
            class="visually-hidden"
            :value="true"
            v-model="shouldFilterUnread"
          />
          <span class="visually-hidden">Filter by unread</span>
          <i class="material-icons">filter_list</i>
        </label>
      </div>
    </div>

    <div class="feed-row" v-for="item in renderedItems" :key="item.id">
      <label>
        <input type="checkbox" :value="item.id" v-model="checkedItemIds" />
        <span class="visually-hidden">{{ item.title }}</span>
      </label>
      <FeedItemCard class="full" :item="item" />
    </div>
  </div>
</template>

<script>
import { put } from "@/utils/api";
import FeedItemCard from "./FeedItemCard.vue";

export default {
  name: "NewsFeed",
  components: {
    FeedItemCard
  },
  props: {
    items: Array
  },
  data() {
    return {
      areAllChecked: false,
      checkedItemIds: [],
      shouldFilterUnread: false
    };
  },
  computed: {
    filteredItems() {
      return this.items.filter(item => !item.isRead);
    },
    renderedItems() {
      return this.shouldFilterUnread ? this.filteredItems : this.items;
    }
  },
  methods: {
    handleMarkAll(status) {
      const newIsReadStatus = status === "read";
      const payload = this.checkedItemIds.map(id => ({
        id: id,
        isRead: newIsReadStatus
      }));

      // TODO: catch/handle error
      put("/item", { items: payload }).then(({ status }) => {
        if (status !== 200) {
          // TODO: catch/handle error
          return;
        }

        this.items = this.items.map(item => {
          if (this.checkedItemIds.indexOf(item.id) < 0) {
            return item;
          }

          return {
            ...item,
            isRead: newIsReadStatus
          };
        });

        this.areAllChecked = false;
        this.checkedItemIds = [];
      });
    }
  },
  watch: {
    areAllChecked(selectEverything) {
      this.checkedItemIds = selectEverything
        ? this.renderedItems.map(item => item.id)
        : [];
    }
  }
};
</script>

<style scoped>
button + button {
  margin-left: 1rem;
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
