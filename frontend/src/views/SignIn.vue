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
    <button id="sign-in" class="btn btn-primary" @click="signIn">Sign In</button>

    <div class="h-30">&nbsp;</div>

    <div id="signInDiv" ref="googleSignInButton"></div>
  </div>
</template>

<script>
import { $http } from '../utils/$http.ts';
import { io } from 'socket.io-client';

export default {
  data() {
    return {
      signInEmail: '',
      signInPassword: '',
      emailCheckResult: '',
      loggedIn: false, // Add loggedIn property
    };
  },

  mounted() {
    const socket = io('https://localhost:3000');

    socket.on('login', (sessionId) => {
      // Update local storage with the new session id
      localStorage.setItem('sessionId', sessionId);

      // Set loggedIn to true
      this.$root.loggedIn = true;

      // Redirect to birthday list page
      this.$router.push('/birthdays');
    });

    // Load Google Sign-In JavaScript library dynamically
    const loadGoogleSignInLibrary = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      document.body.appendChild(script);
    };

    loadGoogleSignInLibrary();

    // Initialize the Google Sign-In client once the library is loaded
    window.onGoogleLibraryLoad = () => {
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: this.handleCredentialResponse,
        callbackUrl: 'https://localhost:3000/google-login',
      });
      google.accounts.id.renderButton(document.getElementById('signInDiv'), {
        theme: 'filled_blue',
        size: 'large',
        text: 'long',
        type: 'standard',
      });
    };
  },

  methods: {
    signIn() {
      console.log('Sign-in button clicked');

      const socket = io('https://localhost:3000');
      // Send a POST request to the backend
      $http
          .post('/sessions', {
            email: this.signInEmail,
            password: this.signInPassword,
          })
          .then((response) => {
            console.log('Sign-in successful');
            // Save session id to the local storage
            localStorage.setItem('sessionId', response.id);
            // Set loggedIn to true
            this.$root.loggedIn = true;
            // Emit event to notify other tabs about login
            socket.emit('login', response.id);
            // Redirect to birthday list page
            this.$router.push('/birthdays');
          })
          .catch((error) => {
            console.error('Sign-in error:', error);
            // Handle sign-in error
          });
    },

    handleCredentialResponse(response) {
      console.log('handleCredentialResponse', response);
      // Send the response to the backend
      $http
          .post('/google-login', {
            token: response.credential,
          })
          .then((response) => {
            // Save to localStorage
            const sessionId = response.sessionId; // Fix: Access sessionId directly from the response object
            localStorage.setItem('sessionId', sessionId);
            console.log('signIn.vue', sessionId);
            // Set loggedIn to true
            this.loggedIn = true;
            // Emit event to notify other components about login
            this.$emit('loggedInChange', this.loggedIn);
            // Redirect to list of items page
            this.$router.push('/birthdays');
          })
          .catch((error) => {
            console.error(error);
          });
    },

    clearEmailError() {
      this.emailCheckResult = '';
    },
    /*
    checkEmail() {
      // If the email is empty, don't send a request
      if (!this.signInEmail) {
        this.emailCheckResult = '';
        return;
      }

      // Send a POST /users/check-email request to the backend
      $http
          .post('/users/check-email', {
            email: this.signInEmail,
          }, { disableErrorHandling: true })
          .then((response) => {
            // Check if the response contains the expected data
            if (response && response.result && response.result.length) {
              this.emailCheckResult = response.result;
            } else {
              this.emailCheckResult = 'Unexpected response';
            }
          })
          .catch((error) => {
            // Check if the error response has a status code
            if (error.response && error.response.status === 409) {
              this.emailCheckResult = 'Email already in use';
            } else {
              console.error(error);
              this.emailCheckResult = 'Error occurred';
            }
          });
    },
*/
  },
};
</script>

<style>
.invisible {
  visibility: hidden;
}
</style>