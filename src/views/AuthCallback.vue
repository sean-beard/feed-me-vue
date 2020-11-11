<template>
  <h1>Signing you in...</h1>
</template>

<script>
import { mapActions } from "vuex";
import { get } from "@/utils/api";

export default {
  methods: {
    ...mapActions(["setIsAuthenticated"])
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
      }
    );
  }
};
</script>