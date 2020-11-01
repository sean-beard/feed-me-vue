<template>
  <div>
    <nav>
      <h1>FeedMe</h1>
      <div>
        <button v-if="this.isAuthenticated" @click="logout">
          Logout
        </button>
        <a
          v-if="!this.isAuthenticated"
          href="http://localhost:4001/auth/github"
        >
          Login to Github
        </a>
      </div>
    </nav>

    <p v-if="loading">Loading...</p>

    <div class="layout">
      <section>
        <div v-for="item in feedItems" :key="item.guid">
          <FeedItemCard
            :item="item"
            v-on:feed-item-clicked="handleFeedItemClick"
          />
        </div>
      </section>
      <section
        class="item-desc"
        v-if="!!selectedDesc"
        v-html="selectedDesc"
      ></section>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import FeedItemCard from "@/components/FeedItemCard";

export default {
  name: "Home",
  components: {
    FeedItemCard
  },
  data() {
    return {
      loading: false,
      feedItems: [],
      selectedDesc: ""
    };
  },
  methods: {
    ...mapActions(["setIsAuthenticated"]),
    logout() {
      fetch("http://localhost:4001/auth/logout")
        .then(resp => resp.json())
        .then(({ status }) => {
          if (status === 200) {
            this.setIsAuthenticated({ isAuthenticated: false, token: "" });
          }
        });
    },
    getFeeds() {
      this.loading = true;

      fetch("http://localhost:4001/feed", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.authToken}`
        }
      })
        .then(r => r.json())
        .then(feeds => {
          const feedItems = feeds.map(({ items }) => items);
          // TODO: flatten this
          this.feedItems = feedItems[0];
          this.loading = false;
        });
    },
    handleFeedItemClick(guid) {
      const item = this.feedItems.find(item => item.guid === guid);

      if (item) {
        this.selectedDesc = item.description;
      }
    }
  },
  computed: {
    ...mapState(["isAuthenticated", "authToken"])
  },
  created() {
    if (this.isAuthenticated) {
      this.getFeeds();
    }
  }
};
</script>

<style scoped>
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.layout {
  display: flex;
}

.item-desc {
  flex: 2;
}
</style>