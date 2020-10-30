<template>
  <div class="home">
    <button v-if="this.isAuthenticated" @click="logout">
      Logout
    </button>
    <a v-if="!this.isAuthenticated" href="http://localhost:4001/auth/github">
      Login to Github
    </a>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "Home",
  methods: {
    ...mapActions(["setIsAuthenticated"]),
    logout() {
      fetch("http://localhost:4001/auth/logout")
        .then(resp => resp.json())
        .then(({ status }) => {
          if (status === 200) {
            this.setIsAuthenticated({ isAuthenticated: false, token: "" });
          }
        });
    }
  },
  computed: {
    ...mapState(["isAuthenticated", "authToken"])
  },
  created() {
    if (this.isAuthenticated) {
      fetch("http://localhost:4001/subscription", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.authToken}`
        }
      })
        .then(r => r.json())
        .then(data => {
          console.log(data);
        });
    }
  }
};
</script>
