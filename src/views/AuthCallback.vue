<template>
  <h2 v-if="error">{{ error }}</h2>
  <h2 v-else>Signing you in...</h2>
</template>

<script>
import { mapActions } from "vuex";
import { get } from "@/utils/api";

const errorMessage = "Oops! There was an error logging in. Please try again later.";

export default {
  methods: {
    ...mapActions(["setIsAuthenticated"])
  },
  data() {
    return {
      error: ''
    }
  },
  created() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    get(`/auth/github/callback?code=${code}`, { useAuth: false }).then(
      ({ status, token }) => {
        if (status === 200) {
          this.setIsAuthenticated({ isAuthenticated: true, authToken: token });
          this.$router.push({ name: "Home" });
        }

        if (status === 500) {
          this.error = errorMessage;
        }
      }
    ).catch(() => {
      this.error = errorMessage;
    });
  }
};
</script>
