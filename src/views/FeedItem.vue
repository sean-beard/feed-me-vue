<template>
  <div>
    <button class="btn" @click="toggleReadStatus()">
      {{ item.isRead ? "Mark as unread" : "Mark as read" }}
    </button>

    <h2 if="error">{{ error }}</h2>

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
      item: {},
      error: ""
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
    }
  },
  created() {
    if (!this.isAuthenticated) {
      this.error = "Oops! You must be logged in to do that";
      return;
    }

    get(`/item/${this.$route.params.id}`).then(({ status, item }) => {
      if (status === 500) {
        this.error = "There was an error loading this feed item";
        return;
      }

      this.item = item;
    });
  }
};
</script>

<style scoped>
.btn {
  margin: 2rem 0;
}
</style>
