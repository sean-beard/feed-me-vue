<template>
  <router-link
    class="card-panel indigo-text text-darken-4"
    :class="{ unread: !item.isRead }"
    :to="{ name: 'FeedItem', params: { id: this.item.id } }"
  >
    {{ item.title }}
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
.card-panel {
  display: block;
  margin: 1rem auto;
  padding: 1rem;
  width: 80%;
  max-width: 750px;
}

.card-panel:hover {
  background-color: #bbbbbb;
}

.card-panel.unread {
  border-left: 4px solid #1a237e;
  font-weight: bold;
}
</style>
