<template>
  <div>
    <div v-if="isLoading">Loading...</div>
    <h2 v-else-if="error">{{ error }}</h2>
    <div v-else>
      <button class="btn" @click="toggleReadStatus()">
        {{ item.isRead ? "Mark as unread" : "Mark as read" }}
      </button>

      <div v-if="!!item.description" v-html="item.description"></div>
    </div>
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
      isLoading: false,
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
  },
  mounted() {
    this.isLoading = true;

    get(`/item/${this.$route.params.id}`)
      .then(({ status, item }) => {
        if (status === 500) {
          this.error = "There was an error loading this feed item";
          return;
        }

        this.item = item;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
};
</script>

<style scoped>
.btn {
  margin: 2rem 0;
}
</style>
