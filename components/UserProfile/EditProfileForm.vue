<template>
  <card>
    <h5 slot="header" class="title">Edit Profile</h5>
    <form @submit.prevent="updateProfile">
      <div class="row">
        <div class="col-md-3">
          <base-input
            type="text"
            label="Username"
            placeholder="Username"
            v-model="user.username"
          >
          </base-input>
        </div>
        <div class="col-md-4">
          <base-input
            type="email"
            label="Email address"
            placeholder="youradd@gmail.com"
            v-model="user.email"
            :disabled="true"
          >
          </base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <base-input
            type="text"
            label="First Name"
            placeholder="First Name"
            v-model="user.firstname"
            :disabled="true"
          >
          </base-input>
        </div>
        <div class="col-md-6">
          <base-input
            type="text"
            label="Last Name"
            placeholder="Last Name"
            v-model="user.lastname"
            :disabled="true"
          >
          </base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <base-input label="About Me">
            <textarea
              class="form-control"
              placeholder="ZIP Code"
              v-model="user.aboutMe"
            >
            </textarea>
          </base-input>
        </div>
      </div>

      <base-button native-type="submit" type="primary" class="btn-fill">
        Save
      </base-button>
    </form>
  </card>
</template>
<script>
export default {
  props: {
    userData: {
      type: Object,
    },
  },
  methods: {
    updateProfile() {
      let payload = {
        ...this.user,
        ...this.userData
      }
      const profileOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      };
      alert('Your data: ' + JSON.stringify(payload));
      fetch("http://localhost:8000/personal/profile", profileOptions).then(r => r.json());
    }
  },
  computed: {
    user() {
      return {
        ...this.userData,
        username: '',
        aboutMe: "Write something about you !"
        };
    }
  },
};
</script>
<style></style>
