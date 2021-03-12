export const state = () => ({
    isLive: false
})


export const mutations = {
    toggle(state, value) {
      console.log("JE SUIS LE MUTATEUR")
      state.isLive = value
    }
}