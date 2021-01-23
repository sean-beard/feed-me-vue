<template>
  <div>
    <div v-if="loading"><FeedSkeleton /></div>
    <h2 v-else-if="error">{{ error }}</h2>

    <div v-if="this.isAuthenticated">
      <section>
        <NewsFeed v-if="feedItems.length" :items="feedItems" />

        <h2 v-if="!feedItems.length && !error && !loading">
          Nothing to see here... Head over to "Manage Feeds" to subscribe to
          your first feed!
        </h2>
      </section>
    </div>

    <PreLoginHome v-if="!this.isAuthenticated" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { pipe, map, flatten, sort } from "ramda";
import FeedSkeleton from "@/components/FeedSkeleton";
import NewsFeed from "@/components/NewsFeed.vue";
import PreLoginHome from "@/components/PreLoginHome";
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
    FeedSkeleton,
    PreLoginHome,
    NewsFeed
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
