import Home from "@/modules/home/pages/Home.vue";
import Vendors from "@/modules/vendors/pages/Vendors.vue";

export default [
  {
    path: "/home",
    component: Home,
    name: "home",
    meta: {
      authRequired: true
    },
    children: [
      {
        path: "",
        name: "vendors",
        component: Vendors,
        meta: {
          authRequired: true
        }
      }
    ]
  }
];
