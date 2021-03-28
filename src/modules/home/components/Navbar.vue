<template>
  <div class="navbar flex justify-between p-4 shadow-lg">
    <div class="logo-container">
      <router-link class="flex items-center" :to="{ name: 'dashboard' }">
        <img class="h-12 mx-auto" src="@/assets/images/logo-white.svg" alt="" />
        <p class="text-lg font-bold ml-4 text-gray-100">
          Orba <span class="text-primary">One</span>
        </p>
      </router-link>
    </div>
    <div class="flex items-center" v-if="this.isAuthenticated">
      <quota class="mr-4" />
      <dropdown />
    </div>
    <div class="flex items-center" v-else>
      <div>
        <p class="font-thin text-gray-100 mr-5">Hi, Admin</p>
      </div>
      <div>
        <p
          class="font-bold text-gray-100 mr-3 cursor-pointer"
          @click="this.logoutUser"
        >
          Logout
        </p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
const Auth = namespace("auth");

@Component({
  components: {}
})
export default class Navbar extends Vue {
  @Auth.Action("logout") logout!: () => Promise<{}>;
  logoutUser() {
    this.logout().then(() => {
      this.$router.replace({ name: "login" });
    });
  }
}
</script>
<style scoped>
.navbar {
  background-color: #00163a;
}
</style>
