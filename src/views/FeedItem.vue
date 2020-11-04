<template>
  <div v-if="!!item.description" v-html="item.description"></div>
</template>

<script>
import { mapState } from "vuex";

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

    fetch(`http://localhost:4001/item/${this.$route.params.id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.authToken}`
      }
    })
      .then(response => response.json())
      .then(feedItem => {
        this.item = feedItem;
      });
  }
};
</script>