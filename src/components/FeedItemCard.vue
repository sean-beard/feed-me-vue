<template>
  <div class="card">
    <router-link
      class="card-link"
      :to="{ name: 'FeedItem', params: { id: this.item.id } }"
    >
      <p>{{ item.title }}</p>
    </router-link>
  </div>
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
.card {
  border: 1px solid black;
}

.card-link {
  width: 100%;
  cursor: pointer;
}
</style>