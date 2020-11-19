<template>
  <div>
    <h2 v-if="loading">Loading...</h2>
    <h2 v-else-if="error">{{ error }}</h2>

    <div v-if="this.isAuthenticated">
      <section>
        <div v-for="item in feedItems" :key="item.id">
          <FeedItemCard :item="item" />
        </div>
      </section>
    </div>

    <!-- TODO: implement pre-login homepage -->
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
      error: "",
      feedItems: []
    };
  },
  methods: {
    getFeeds() {
      this.loading = true;

      get("/feed")
        .then(({ status, feeds }) => {
          if (status === 500) {
            this.error = "There was an error loading your feeds";
            return;
          }

          const feedItems = (feeds || []).map(({ name, items }) =>
            items.map(item => {
              item.feedName = name;
              item.pubDate = new Date(item.pubDate);
              return item;
            })
          );
          this.feedItems = flatten(feedItems).sort(
            (a, b) => b.pubDate - a.pubDate
          );
        })
        .catch(() => {
          this.error = "There was an error loading your feeds";
        })
        .finally(() => {
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
