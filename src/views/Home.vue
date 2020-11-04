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

    <div v-if="this.isAuthenticated">
      <section>
        <div v-for="item in feedItems" :key="item.id">
          <FeedItemCard :item="item" />
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { flatten } from "ramda";
import FeedItemCard from "@/components/FeedItemCard";

export default {
  name: "Home",
  components: {
    FeedItemCard
  },
  data() {
    return {
      loading: false,
      feedItems: []
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
          this.feedItems = flatten(feedItems);
          this.loading = false;
        });
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
</style>