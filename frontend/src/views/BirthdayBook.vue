<script>
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
  //Add signOut method
  methods: {
    signOut() {
      //Remove sessionId from the local storage
      localStorage.removeItem('sessionId')
      //Redirect to sign-in page
      this.$router.push('/signin')
    },
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
    <!--Add sign out button that will call signOut method
    <button class="btn btn-primary" v-on:click="signOut">Sign Out</button>
    Disable Sign Out button if there is no sessionId in the local storage
<button class="btn btn-primary" v-on:click="signOut" v-if="localStorage.getItem('sessionId')">Sign Out</button>-->

    <button :disabled="isSessionIdEmpty" @click="signOut">Sign Out</button>
  </div>
</template>

<style scoped>
.text-center {
  text-align: center;
}
</style>