<template>
  <div id="app">
    <Nav />
    <router-view />
  </div>
</template>

<script>
import "materialize-css/dist/css/materialize.min.css";
import "materialize-css/dist/js/materialize.min";

import Nav from "./components/Nav";

export default {
  name: "App",
  components: { Nav }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.btn {
  background-color: #1a237e;
}

.btn:hover,
.btn:focus {
  background-color: white;
  color: #1a237e;
}
</style>
