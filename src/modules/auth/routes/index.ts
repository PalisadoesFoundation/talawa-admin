import Login from "@/modules/auth/pages/Login.vue";

export default [
  {
    path: "/",
    component: Login,
    name: "login",
    meta: {
      guest: true
    }
  }
];
