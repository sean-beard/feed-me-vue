<template>
  <div>
    <section>
      <SubscriptionForm />
    </section>
  </div>
</template>

<script>
import SubscriptionForm from "@/components/SubscriptionForm";

export default {
  name: "FeedManager",
  components: {
    SubscriptionForm
  }
};
</script>

<style scoped>
h2 {
  font-size: 2rem;
}
</style>
