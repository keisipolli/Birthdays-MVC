<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/terms">Terms</router-link>
      <router-link v-if="!loggedIn" to="/signup">Sign Up</router-link>
      <router-link v-if="!loggedIn" to="/signin">Sign In</router-link>
      <router-link v-if="loggedIn" to="/birthdays">Birthdays</router-link>
      <a v-if="loggedIn" href="#" @click="logout">Sign Out</a>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      loggedIn: false,
    };
  },
  created() {
    this.checkLoggedIn();
  },
  methods: {
    checkLoggedIn() {
      const sessionId = localStorage.getItem('sessionId');
      if (sessionId) {
        // Check with server to validate session
        // If valid, set loggedIn to true
        this.loggedIn = true;
      }
    },
    logout() {
      localStorage.removeItem('sessionId');
      this.loggedIn = false;
      this.$router.push('/');
    },
  },
};
</script>
<style>
nav {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background-color: #eee;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
}

nav a {
  padding: 5px;
  text-decoration: none;
  color: #333;
  font-weight: bold;
}

nav a:not(:last-child) {
  margin-right: 20px;
}

@media (max-width: 768px) {
  nav {
    flex-direction: column;
    justify-content: center;
    height: 100%;
  }

  nav a {
    margin-right: 0;
    margin-bottom: 10px;
  }

  nav a:last-child {
    margin-bottom: 0;
  }
}
</style>


