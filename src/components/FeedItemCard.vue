<template>
  <div class="card">
    <button class="card-btn" @click="handleClick">
      <p>{{ item.title }}</p>
    </button>
  </div>
</template>

<script>
export default {
  name: "FeedItemCard",
  props: {
    item: Object
  },
  methods: {
    handleClick() {
      this.$emit("feed-item-clicked", this.item.guid);
    }
  }
};
</script>

<style scoped>
.card {
  border: 1px solid black;
}

.card-btn {
  width: 100%;
  cursor: pointer;
}
</style>