<template>
  <div>
    <h2>Subscribe to a feed</h2>

    <p v-if="successMsg">{{ successMsg }}</p>
    <h3 v-else-if="error" class="error">{{ error }}</h3>

    <form @submit="subscribe">
      <div class="input-field">
        <input id="url" class="validate" type="text" v-model="url" required />
        <label for="url">Enter the RSS feed URL</label>
      </div>
      <button class="btn" type="submit" :disabled="isLoading">
        {{ isLoading ? "Subscribing..." : "Subscribe" }}
      </button>
    </form>
  </div>
</template>

<script>
import { post } from "@/utils/api.js";

export default {
  name: "SubscriptionForm",
  data() {
    return {
      url: "",
      isLoading: false,
      successMsg: "",
      error: ""
    };
  },
  methods: {
    subscribe(event) {
      event.preventDefault();

      if (!this.url.trim()) {
        return;
      }

      this.isLoading = true;
      this.successMsg = "";
      this.error = "";

      post("/subscription", { url: this.url })
        .then(({ status }) => {
          if (status === 200) {
            this.successMsg = "Successfully subscribed!";
            this.url = "";
            this.eventHub.$emit("subscribe");
          }

          if (status === 500) {
            this.error =
              "Oops! There was an error subscribing. Please try again later.";
          }
        })
        .catch(() => {
          this.error =
            "Oops! There was an error subscribing. Please try again later.";
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  }
};
</script>

<style scoped>
.input-field {
  margin: 1rem auto;
  max-width: 400px;
  width: 80%;
}

.error {
  color: maroon;
  font-size: 1.5em;
  margin-bottom: 2rem;
}
</style>
