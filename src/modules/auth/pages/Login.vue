<template>
  <div class="flex w-full h-screen bg-white">
    <div class="hidden lg:flex items-center primary-background md:w-2/5">
      <div class="relative">
        <img
          class="hero-image-login"
          src="@/assets/images/screenshot.svg"
          alt="Orba One"
        />
      </div>
    </div>
    <div class="flex flex-col w-full lg:w-3/5">
      <div class="w-full text-right mt-8">
        <a
          href="https://orbaone.com"
          class="mr-4  text-right text-primary font-bold"
          >Back to Orba One</a
        >
      </div>

      <form
        class="flex flex-col flex-1 p-4 justify-center  w-full max-w-md mx-auto"
        @submit.prevent="submitForm"
      >
        <div class="flex flex-col mt-4 text-left">
          <p class="text-4xl mt-3 text-gray-800 font-bold font-headings">
            Welcome back,
          </p>
          <p class="text-4xl mb-5 text-gray-800 font-bold font-headings">
            please login.
          </p>
          <p v-if="error" class="form-error font-bold text-sm my-3">
            {{ error }}
          </p>
          <label for="email" class="text-sm text-gray-700 text-left"
            >Email</label
          >
          <input
            v-model="$v.loginForm.email.$model"
            class="input"
            type="text"
            name="email"
            autofocus
            data-testid="login-email-input"
            placeholder="admin@example.com"
          />
          <div v-if="$v.loginForm.email.$error">
            <p v-if="$v.loginForm.email.$invalid" class="form-error">
              The email entered is invalid
            </p>
            <p v-else-if="$v.loginForm.email.required" class="form-error">
              Please enter an email
            </p>
          </div>
        </div>
        <div class="flex flex-col mt-4">
          <label for="password" class="text-sm text-gray-700 text-left"
            >Password</label
          >
          <input
            v-model="$v.loginForm.password.$model"
            class="input"
            type="password"
            name="password"
            data-testid="login-password-input"
            placeholder="Password"
          />
          <div v-if="$v.loginForm.password.$error">
            <p v-if="$v.loginForm.password.required" class="form-error">
              Please enter your password
            </p>
          </div>
        </div>
        <button
          :disabled="this.$v.loginForm.$invalid"
          class="btn btn-primary mt-4"
          type="submit"
        >
          <p class="inline" v-if="!loading">
            Login
          </p>
          <img
            v-else
            class="h-8 inline ml-3"
            src="@/assets/images/loader.svg"
            alt=""
          />
        </button>
        <div class="text-center mt-4">
          <p>
            Don't have an account?
            <router-link class="text-primary font-bold" to="/signup"
              >Sign up</router-link
            >
            instead.
          </p>
        </div>
        <div>
          <img
            class="h-16 mx-auto mt-10"
            src="@/assets/images/logo-dark.svg"
            alt="logo"
          />
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { required, email } from "vuelidate/lib/validators";
import { namespace } from "vuex-class";
import { LoginPayload } from "../types";

const Auth = namespace("auth");
@Component({
  components: {}
})
export default class Login extends Vue {
  @Auth.Action("login") login!: (payload: LoginPayload) => Promise<{}>;

  loading = false;
  error = "";
  loginForm = {
    email: "",
    password: ""
  };

  submitForm() {
    this.loading = true;
    this.login({
      email: this.loginForm.email,
      password: this.loginForm.password
    })
      .then(() => {
        this.$router.replace({ name: "vendors" });
        this.loading = false;
      })
      .catch(err => {
        this.error = err.message;
        this.loading = false;
      });
  }

  validations() {
    return {
      loginForm: {
        email: {
          required,
          email
        },
        password: {
          required
        }
      }
    };
  }
}
</script>

<style>
.primary-background {
  background: rgb(0, 22, 58);
  background: linear-gradient(
    4deg,
    rgba(0, 22, 58, 1) 0%,
    rgba(4, 31, 75, 1) 50%,
    rgba(12, 47, 105, 1) 100%
  );

  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.hero-image-login {
  margin-left: 120px;
}
</style>
