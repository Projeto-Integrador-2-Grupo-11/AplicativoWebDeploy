export default function({ store, app, redirect }) {
  const loggedUser = process.server
    ? app.$cookiz.get('user')
    : store.getters['modules/user/loggedUser'];
  if (loggedUser) {
    store.commit('modules/user/SET_USER', loggedUser);
    if (process.browser && app.$firebaseAuth.currentUser) {
      app.$firebaseAuth.currentUser
        .getIdToken(true)
    }
  }
}