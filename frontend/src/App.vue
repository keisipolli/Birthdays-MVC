<template>
  <div id="app">
    <nav>
      <router-link to="/signup">
        <i class="fas fa-user-plus"></i> Sign Up
      </router-link>
      <router-link to="/terms">
        <i class="fas fa-file-alt"></i> Terms & Policies
      </router-link>
      <router-link to="/signin">
        <i class="fas fa-sign-in-alt"></i> Sign In
      </router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

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

<script>
export default {
  name: 'App',
};

</script>
