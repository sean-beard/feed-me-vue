<template>
  <div v-if="!!item.description" v-html="item.description"></div>
</template>

<script>
import { mapState } from "vuex";
import { get } from "@/utils/api";

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
