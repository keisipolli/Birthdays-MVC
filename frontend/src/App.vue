<template>
  <div id="app">
    <nav>
      <router-link v-if="!isLoggedIn" to="/signup">
        <i class="fas fa-user-plus"></i> Sign Up
      </router-link>
      <router-link v-if="!isLoggedIn" to="/">
        <i class="fas fa-home"></i> Home
      </router-link>
<!--      Dont use for now: margo 14.04.2023-->
<!--      <router-link v-if="isLoggedIn" to="/birthdays">-->
<!--        <i class="fas fa-birthday-cake"></i> Birthdays-->
<!--      </router-link>-->
      <router-link to="/terms">
        <i class="fas fa-file-alt"></i> Terms & Policies
      </router-link>
      <router-link v-if="!isLoggedIn" to="/signin">
        <i class="fas fa-sign-in-alt"></i> Sign In
      </router-link>
<!--      Add sign out button but do not use it because it does not make sessions-->
<!--      <router-link v-if="isLoggedIn" to="/" @click="signOut">-->
<!--        <i class="fas fa-sign-out-alt"></i> Sign Out-->
<!--      </router-link>-->
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>

import {$http} from "./utils/http.ts";

export default {
  name: 'App',
  computed: {
    sessionId() {
      return localStorage.getItem('sessionId')
    },
    isSessionIdEmpty() {
      return !localStorage.getItem('sessionId')
    },
    isLoggedIn() {
      return this.sessionId !== null
    }
  },

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
    onStorage(event) {
      if (event.key === 'sessionId') {
        this.$forceUpdate(); // Force re-evaluation of computed properties
      }
    }
  },

  created() {
    window.addEventListener('storage', this.onStorage);
  },

  beforeDestroy() {
    window.removeEventListener('storage', this.onStorage);
  }
}
</script>


<!--      <router-link to="/signup">-->
<!--        <i class="fas fa-user-plus"></i> Sign Up-->
<!--      </router-link>-->
<!--      <router-link to="/terms">-->
<!--        <i class="fas fa-file-alt"></i> Terms & Policies-->
<!--      </router-link>-->
<!--      <router-link to="/signin">-->
<!--        <i class="fas fa-sign-in-alt"></i> Sign In-->
<!--      </router-link>-->
<!--    </nav>-->
<!--    <router-view></router-view>-->
<!--  </div>-->
<!--</template>-->

<style scoped>

nav a {
  padding: 10px;
  margin-right: 20px;
  margin-bottom: 50px;
  text-align: center;
}
nav a {
  font-family: 'Segoe UI', sans-serif;
  font-size: 16px;
}
nav a:hover {
  color: #0077cc;
  text-decoration: underline;
}

</style>
