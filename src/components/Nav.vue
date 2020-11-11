<template>
  <nav>
    <h1>FeedMe</h1>
    <div>
      <button v-if="this.isAuthenticated" @click="logout">
        Logout
      </button>
      <a v-if="!this.isAuthenticated" :href="`${apiBaseUrl}/auth/github`">
        Login to Github
      </a>
    </div>
  </nav>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { get } from "@/utils/api";

export default {
  name: "Nav",
  data() {
    return {
      apiBaseUrl: process.env.VUE_APP_BASE_API_URL
    };
  },
  computed: {
    ...mapState(["isAuthenticated"])
  },
  methods: {
    ...mapActions(["setIsAuthenticated"]),
    logout() {
      get("/auth/logout", { useAuth: false }).then(({ status }) => {
        if (status === 200) {
          this.setIsAuthenticated({ isAuthenticated: false, token: "" });
        }
      });
    }
  }
};
</script>

<style scoped>
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}
</style>
