<template>
  <div>
    <button @click="toggleReadStatus()">
      {{ item.isRead ? "Mark as unread" : "Mark as read" }}
    </button>
    <div v-if="!!item.description" v-html="item.description"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { get, post } from "@/utils/api";

export default {
  name: "FeedItem",
  data() {
    return {
      item: {}
    };
  },
  computed: {
    ...mapState(["isAuthenticated", "authToken"])
  },
  methods: {
    toggleReadStatus() {
      post("/item", { id: this.item.id, isRead: !this.item.isRead }).then(
        ({ isRead }) => {
          this.item.isRead = isRead;
        }
      );
    }
  },
  created() {
    if (!this.isAuthenticated) {
      // TODO: handle this
      return;
    }

    get(`/item/${this.$route.params.id}`).then(feedItem => {
      this.item = feedItem;
    });
  }
};
</script>
