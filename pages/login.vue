<template>
  <div>
    <h1>Welcome to "whatever-project-name", you have to be logged to use this service</h1>

    <div><base-button @click="loginClicked()">Login with Google</base-button></div>

    <div v-if="isAlive == true">Backend est Live !</div>
    <div v-else>Backend est Cassée !</div>

  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  fetchOnServer: false,
  name: 'login',
  layout: 'test',
  transition: 'fade',
  data () {
    return {};
  },
  async fetch() {
    const response = await this.$http.$get('http://localhost:8000/healthcheck/?format=json');
    if (response.DatabaseBackend === "working")
      this.$store.commit('server/toggle', true);

  },
  methods: {
    async loginClicked() {
      try {
        //let res = await this.$auth.loginWith('google', { params: { another_post_key: "value" } });
        let res = await this.$auth.loginWith('google');
      } catch (err) {
        this.consoleLog("login error: " + err);
      }
    },
    ...mapMutations({
      server: 'server/toggle'
    })
  },
  computed: {
    isAlive () {
      return this.$store.state.server.isLive
    }
  }
}
</script>

<style>
</style>