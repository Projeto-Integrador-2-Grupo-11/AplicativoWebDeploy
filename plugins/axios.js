export default ({ $axios, store, app, route, redirect }) => {
  $axios.onRequest((config) => {
    if (config.url.match('wp-json')) config.baseURL = app.$env.API_URL_BLOG;
    else config.baseURL = app.$env.API_URL;
    config.browserBaseURL = app.$env.API_URL;
  });
  $axios.interceptors.response.use(
    function(response) {
      return response;
    },
    function(error) {
      if (error.response.status === 403) {
        store.dispatch('modules/user/logOutWithOutReload').then(() => {
          app.$cookiz.removeAll();
          app.$cookiz.remove('token');
          app.$cookiz.set('redirect', route.path);
          redirect('/login/?errorForbidden=true');
        });
        return Promise.reject({message:'Sessão expirada'});
      }
      return Promise.reject(error);
    },
  );
};
