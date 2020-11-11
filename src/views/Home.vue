<template>
  <div>
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
import { mapState } from "vuex";
import { flatten } from "ramda";
import FeedItemCard from "@/components/FeedItemCard";
import { get } from "@/utils/api";

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
    getFeeds() {
      this.loading = true;

      get("/feed").then(feeds => {
        const feedItems = feeds.map(({ items }) => items);
        this.feedItems = flatten(feedItems);
        this.loading = false;
      });
    }
  },
  computed: {
    ...mapState(["isAuthenticated"])
  },
  created() {
    if (this.isAuthenticated) {
      this.getFeeds();
    }
  }
};
</script>
