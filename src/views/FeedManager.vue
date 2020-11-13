<template>
  <div>
    <section>
      <h2>Subscribe to a feed</h2>

      <p v-if="hasSuccess">Successfully subscribed!</p>
      <p v-else-if="hasError">
        Oops! There was an error subscribing. Please try again later.
      </p>

      <form @submit="subscribe">
        <div class="input-field">
          <input id="url" class="validate" type="text" v-model="url" required />
          <label for="url">Enter the RSS feed URL</label>
        </div>
        <button class="btn" type="submit">
          Subscribe
        </button>
      </form>
    </section>
  </div>
</template>

<script>
import { post } from "@/utils/api.js";

export default {
  name: "FeedManager",
  data() {
    return {
      url: "",
      hasSuccess: false,
      hasError: false
    };
  },
  methods: {
    subscribe(event) {
      event.preventDefault();

      if (!this.url.trim()) {
        return;
      }

      post("/subscription", { url: this.url })
        .then(({ status }) => {
          if (status === 200) {
            this.hasSuccess = true;
            this.url = "";
          }
        })
        .catch(() => {
          this.hasError = true;
        });
    }
  }
};
</script>

<style scoped>
h2 {
  font-size: 2rem;
}

.input-field {
  margin: 1rem auto;
  max-width: 400px;
  width: 80%;
}
</style>
