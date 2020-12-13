<template>
  <div>
    <h2 v-if="loading">Loading...</h2>
    <h2 v-else-if="error">{{ error }}</h2>

    <div v-if="this.isAuthenticated">
      <section>
        <div v-for="item in feedItems" :key="item.id">
          <FeedItemCard :item="item" />
        </div>

        <h2 v-if="!feedItems.length && !error && !loading">
          Nothing to see here... Head over to "Manage Feeds" to subsribe to your
          first feed!
        </h2>
      </section>
    </div>

    <!-- TODO: implement pre-login homepage -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import { pipe, map, flatten, sort } from "ramda";
import FeedItemCard from "@/components/FeedItemCard";
import { get } from "@/utils/api";

const getFeedItemsFromFeed = ({ name, items }) =>
  items.map(item => {
    item.feedName = name;
    item.pubDate = new Date(item.pubDate);
    return item;
  });

const getFeedItems = feeds =>
  pipe(
    map(getFeedItemsFromFeed),
    flatten,
    sort((a, b) => b.pubDate - a.pubDate)
  )(feeds || []);

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
          this.feedItems = getFeedItems(feeds);
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
