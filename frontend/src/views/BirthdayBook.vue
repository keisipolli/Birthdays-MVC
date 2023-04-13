<script>
import {$http} from "../utils/http.ts";

export default {
  data() {
    return {
      signUpEmail: '',
      signUpPassword: '',
      emailCheckResult: ''
    }
  },
  computed: {
    isSessionIdEmpty() {
      return !localStorage.getItem('sessionId')
    },
  },
  methods: {
    signUp() {

      // Send a POST request to the backend
      $http.post('/users', {
        email: this.signUpEmail,
        password: this.signUpPassword
      }).then(response => {
        // Redirect to sign-in page
        this.$router.push('/signin')
      })
    },
    checkEmail() {

      // If the email is empty, don't send a request
      if (!this.signUpEmail) {
        this.emailCheckResult = ''
        return
      }

      // Send a POST /users/check-email request to the backend
      $http.post('/users/check-email', {
        email: this.signUpEmail
      }, {disableErrorHandling: true}).then(response => {
        this.emailCheckResult = '';
      }).catch(response => {
        this.emailCheckResult = response.body.error;
      })
    }
  }
}
</script>
<template>
  <div>
    <h1>BirthdayBook</h1>
  </div>
</template>

<style scoped>
.text-center {
  text-align: center;
}
</style>