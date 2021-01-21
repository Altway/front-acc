<template>
  <div class="row">
    <div class="col-md-8"><edit-profile-form :userData="this.userData"> </edit-profile-form></div>
    <div class="col-md-4"><user-card> </user-card></div>
  </div>
</template>
<script>
import EditProfileForm from '../components/UserProfile/EditProfileForm.vue';
import UserCard from '../components/UserProfile/UserCard.vue';

export default {
  name: 'user',
  components: {
    EditProfileForm,
    UserCard
  },
  fetchOnServer: false,
  data() {
    return {
      userData: {}
    }
  },
  methods: {
    async updateUser() {
      const id = 1
      this.userData = await fetch(`http://localhost:8000/personnal/user/${id}`).then(res => res.json())
      console.log(this.userData)
    }
  },
  mounted() {
    this.updateUser()
  }
};
</script>
<style></style>
