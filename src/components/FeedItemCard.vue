<template>
  <router-link
    class="card-panel indigo-text text-darken-4"
    :class="{ unread: !item.isRead }"
    :to="{ name: 'FeedItem', params: { id: this.item.id } }"
  >
    <p>{{ item.title }}</p>
    <p>{{ item.feedName }}</p>
  </router-link>
</template>

<script>
export default {
  name: "FeedItemCard",
  props: {
    item: Object
  }
};
</script>

<style scoped>
p {
  margin: 0;
}

p + p {
  font-weight: normal;
}

.card-panel {
  display: block;
  margin: 1rem auto;
  padding: 1rem;
  width: 80%;
  max-width: 750px;
}

.card-panel:hover,
.card-panel:focus {
  background-color: #bbbbbb;
}

.card-panel.unread {
  border-left: 4px solid #1a237e;
  font-weight: bold;
}
</style>
