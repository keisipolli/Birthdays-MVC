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

  //Add signOut method
  methods: {
    signOut() {
      // Send a DELETE request to the backend
      $http.delete('/sessions', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('sessionId')
        }
      }).then(response => {
        // Remove sessionId from localStorage
        localStorage.removeItem('sessionId');

        // Redirect to main page
        this.$router.push('/');
      });
    },
  }
}
</script>
<template>
  <div>
    <h1>Welcome to BirthdayBook</h1>
    <button :disabled="isSessionIdEmpty" @click="signOut">Sign Out</button>
  </div>
</template>

<style scoped>
.text-center {
  text-align: center;
}
</style>