<template>
  <h1>Signing you in...</h1>
</template>

<script>
import { mapActions } from "vuex";

export default {
  methods: {
    ...mapActions(["setIsAuthenticated"])
  },
  created() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    fetch(`http://localhost:4001/auth/github/callback?code=${code}`)
      .then(res => res.json())
      .then(({ status, token }) => {
        if (status === 200) {
          this.setIsAuthenticated({ isAuthenticated: true, authToken: token });
          this.$router.push("/");
        }
      });
  }
};
</script>