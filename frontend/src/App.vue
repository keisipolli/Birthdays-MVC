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
import { io } from 'socket.io-client';

export default {
  name: 'App',
  data() {
    return {
      loggedIn: false,
      socket: null, // Add a socket property
    };
  },

  created() {
    this.checkLoggedIn();

    this.checkLoggedIn();
    // Listen changes in Local Storage
    window.addEventListener('storage', this.handleStorageChange);
  },

  mounted() {
    this.createSocketConnection();
  },

  methods: {
    checkLoggedIn() {
      const sessionId = localStorage.getItem('sessionId');
      if (sessionId) {
        // Check with server to validate session. If valid, set loggedIn to true
        this.loggedIn = true;
      }
    },
    createSocketConnection() {
      // Create a WebSocket connection to the server
      this.socket = io('https://localhost:3000', {
        withCredentials: true,
      });
    },

    logout() {
      if (this.socket) {
        console.log('Socket:', this.socket);
        console.log('Socket connected:', this.socket.connected);

        // Remove the sessionId from local storage
        localStorage.removeItem('sessionId');

        // Set a logout flag in local storage to trigger the logout in other tabs
        localStorage.setItem('logoutFlag', Date.now().toString());

        // Perform logout actions here
        this.loggedIn = false;
        this.$router.push('/');

        // Close the WebSocket connection
        this.socket.close();
      }
    },

    handleStorageChange(event) {
      if (event.key === 'logoutFlag') {
        // Check if the logout flag is present in local storage
        const logoutFlag = localStorage.getItem('logoutFlag');
        if (logoutFlag !== null) { // Check if the value is truthy
          // Remove the logout flag from local storage
          localStorage.removeItem('logoutFlag');
          // Perform logout actions here
          this.loggedIn = false;
          this.$router.push('/');
        }
      }
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


