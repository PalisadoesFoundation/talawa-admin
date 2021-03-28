<template>
  <div class="h-screen flex flex-col">
    <navbar />
    <div class="flex flex-1">
      <sidebar></sidebar>
      <div class="flex flex-col p-5 w-full h-full">
        <transition name="v-page-fade">
          <router-view></router-view>
        </transition>
        <div class="flex items-center justify-center pt-2 mt-2">
          <p class="text-gray-700">
            <b>Have any questions</b>? Consult our Help Center or contact us
            directly- we're here to help
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";
import { Vue, Component } from "vue-property-decorator";
@Component({
  components: {
    navbar: Navbar,
    sidebar: Sidebar
  }
})
export default class Home extends Vue {}
</script>
