<template>
  <div>
    Description about me
    <client-only>
    <vue-plyr :options="options">
      <video
        controls
        crossorigin
        playsinline
        data-poster="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.cnetfrance.fr%2Fnews%2Fa-15h-la-premiere-image-d-un-trou-noir-pourrait-changer-notre-perception-de-l-univers-39883293.htm&psig=AOvVaw0fS1HdIlGtyzTpA9ULxB8P&ust=1613498581422000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCOD0k-C87O4CFQAAAAAdAAAAABAE"
      >
      <source
        size="720"
        src="https://static.videezy.com/system/resources/previews/000/044/479/original/banana.mp4"
        type="video/mp4"
      />
      <source
        size="1080"
        src="https://static.videezy.com/system/resources/previews/000/044/479/original/banana.mp4"
        type="video/mp4"
      />
      <!--
      <track
        default
        kind="captions"
        label="English captions"
        src="/path/to/english.vtt"
        srclang="en"
      />-->
      </video>
    </vue-plyr>
    </client-only>
<!--
<vue-plyr>
  <div class="plyr__video-embed">
    <iframe
      src="https://www.youtube.com/embed/bTqVqk7FSmY?amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1"
      allowfullscreen
      allowtransparency
      allow="autoplay"
    ></iframe>
  </div>
</vue-plyr>
<vue-plyr>
  <div data-plyr-provider="youtube" data-plyr-embed-id="bTqVqk7FSmY"></div>
</vue-plyr>

<vue-plyr>
  <div class="plyr__video-embed">
    <iframe
      src="https://player.vimeo.com/video/143418951?loop=false&amp;byline=false&amp;portrait=false&amp;title=false&amp;speed=true&amp;transparent=0&amp;gesture=media"
      allowfullscreen
      allowtransparency
      allow="autoplay"
    ></iframe>
  </div>
</vue-plyr>

<vue-plyr>
  <div data-plyr-provider="vimeo" data-plyr-embed-id="143418951"></div>
</vue-plyr>
-->
  </div>
</template>
<script>

//import VuePlyr from 'vue-plyr/dist/vue-plyr.ssr.js'
import VuePlyr from 'vue-plyr/dist/vue-plyr.ssr.js'
import 'vue-plyr/dist/vue-plyr.css'

export default {
  name: 'edu',
  components: {
  },
  data() {
    return {
      userData: {},
      options: {}
    }
  },
  methods: {
    async updateUser() {
      const id = 1
      //this.userData = await fetch(`http://localhost:8000/personnal/user/${id}`).then(res => res.json())
      //console.log(this.userData)
      console.log("ICICICICI")
      console.log(Vue.version)
    }
  },
  mounted() {
    this.updateUser()
  }
};

</script>
<style></style>