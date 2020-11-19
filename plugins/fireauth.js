export default (context) => {
  const { store, app } = context;
  return new Promise((resolve, reject) => {
    app.$firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        app.$firebaseAuth.currentUser.getIdToken(true);
        app.$cookiz.set('user', user, { maxAge: 60 * 60 * 5, path: '/' });
        return resolve(store.dispatch('modules/user/setUser', user.toJSON()));
      }
      return resolve();
    });
  });
};
