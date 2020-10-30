import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import AuthCallback from "../views/AuthCallback.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/auth/github/callback",
    name: "AuthCallback",
    component: AuthCallback,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
