<template>
  <div>
    <div class="controls">
      <label>
        <input type="checkbox" :value="true" v-model="areAllChecked" />
        <span class="visually-hidden">Select all items</span>
      </label>

      <div class="btn-wrapper" v-if="checkedItemIds.length">
        <button class="btn" @click="handleMarkAll('read')">Mark as Read</button>
        <button class="btn" @click="handleMarkAll('unread')">
          Mark as Unread
        </button>
      </div>
    </div>

    <div class="feed-row" v-for="item in items" :key="item.id">
      <label>
        <input type="checkbox" :value="item.id" v-model="checkedItemIds" />
        <span class="visually-hidden">{{ item.title }}</span>
      </label>
      <FeedItemCard class="full" :item="item" />
    </div>
  </div>
</template>

<script>
import { post } from "@/utils/api";
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
      checkedItemIds: []
    };
  },
  methods: {
    handleMarkAll(status) {
      const newIsReadStatus = status === "read";
      const payload = this.checkedItemIds.map(id => ({
        id: id,
        isRead: newIsReadStatus
      }));

      // TODO: catch/handle error
      post("/item", { items: payload }).then(({ status }) => {
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
        ? this.items.map(item => item.id)
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
  align-items: center;
  margin: 1rem auto;
  width: 80%;
  max-width: 750px;
  min-height: 4.5rem;
}

.feed-row {
  justify-content: center;
}

.full {
  flex: 1;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  border: 0;
  padding: 0;
  clip: rect(0 0 0 0);
  overflow: hidden;
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
}
</style>
