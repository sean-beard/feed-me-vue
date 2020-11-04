<template>
  <div class="card">
    <!-- TODO: can we refer to component here instead? -->
    <a class="card-link" :href="`/#/item/${this.item.id}`">
      <p>{{ item.title }}</p>
    </a>
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