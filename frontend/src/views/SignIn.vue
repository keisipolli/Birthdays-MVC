<template>
  <div>
    <h1>Sign In</h1>

    <!-- Email -->
    <div class="form-control w-full max-w-xs">
      <label class="label">
        <span class="label-text">Email</span>
      </label>
      <input type="text" name="email" placeholder="Type here" class="input input-bordered w-full max-w-xs"
             v-on:blur="checkEmail"
             v-on:keydown="clearEmailError"
             v-model="signInEmail"/>
      <label class="label">
        <!-- Show red text if the email is already taken -->
        <span class="label-text-alt text-red-600" id="email-error"
              :class="{ invisible: emailCheckResult.length === 0 }">
          {{ emailCheckResult }}.
        </span>
      </label>
    </div>

    <!-- Password -->
    <div class="form-control w-full max-w-xs">
      <label class="label">
        <span class="label-text">Password</span>
      </label>
      <input type="password" name="password" placeholder="Type here" class="input input-bordered w-full max-w-xs"
             v-model="signInPassword"/>
      <label class="label">
        <!-- Show red text if the password is too short -->
        <span class="label-text-alt text-red-600" id="password-error"
              :class="{ invisible: !(signInPassword.length > 0 && signInPassword.length < 8) }">Password must be at least 8 characters long</span>
      </label>
    </div>
  </div>
  <div class="h-30">&nbsp;</div>
  <button id="sign-up" class="btn btn-primary"  @click="signIn">Sign In</button>
</template>
<script>
import { $http } from '../utils/$http.ts'

export default {
  data() {
    return {
      signInEmail: '',
      signInPassword: '',
      emailCheckResult: '',
    }
  },
  methods: {
    signIn() {
      // Send a POST request to the backend
      $http.post('/sessions', {
        email: this.signInEmail,
        password: this.signInPassword,
      }).then((response) => {
        // Save session id to the local storage
        localStorage.setItem('sessionId', response.id)
        // Set loggedIn to true
        this.$root.loggedIn = true;
        // Redirect to birthday list page
        this.$router.push('/birthdays')
      }).catch((error) => {
        // Show error message if login fails
        console.log(error)
      })
    },
    clearEmailError() {
      this.emailCheckResult = ''
    },
    checkEmail() {
      // If the email is empty, don't send a request
      if (!this.signInEmail) {
        this.emailCheckResult = ''
        return
      }
      // Send a POST /users/check-email request to the backend
      $http.post('/users/check-email', {
        email: this.signInEmail,
      }, { disableErrorHandling: true })
          .then((response) => {
            this.emailCheckResult         = response.result
          })
          .catch((error) => {
            console.log(error)
          })
    },
  },
  watch: {
    signInEmail: function() {
      this.clearEmailError()
      this.checkEmail()
    },
  },
}
</script>



<style>
.invisible {
  visibility: hidden;
}
</style>