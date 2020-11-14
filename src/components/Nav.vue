<template>
  <nav class="indigo darken-4">
    <h1>
      <router-link :to="{ name: 'Home' }">FeedMe</router-link>
    </h1>

    <div v-if="this.isAuthenticated">
      <ul>
        <li>
          <router-link :to="{ name: 'FeedManager' }">Manage Feeds</router-link>
        </li>
      </ul>

      <button class="btn" @click="logout">
        Logout
      </button>
    </div>

    <a v-if="!this.isAuthenticated" :href="`${apiBaseUrl}/auth/github`">
      Login to Github
    </a>
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

ul {
  display: inline;
}

h1 {
  font-size: 2rem;
  margin: auto 1rem;
}

.btn {
  background-color: #1565c0;
}

.btn:hover,
.btn:focus {
  background-color: white;
  color: #1565c0;
}
</style>
