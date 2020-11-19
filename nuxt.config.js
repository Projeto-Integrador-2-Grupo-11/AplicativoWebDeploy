
/*!

=========================================================
* Nuxt Argon Dashboard PRO - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nuxt-argon-dashboard-pro
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by www.creative-tim.com and www.binarcode.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// import environmental variables from our variables.env file
require("dotenv").config({ path: "variables.env" });

const pkg = require('./package')
console.log('ENV', process.env.NODE_ENV)

module.exports = {
  server: {
    port: process.env.PORT || 3000, // default: 3000
    host: process.env.HOST || '0.0.0.0', // default: localhost
  },
  mode: 'universal',
  router: {
    base: '/',
    linkExactActiveClass: 'active'
  },
  script:[
    {
      src:'https://npmcdn.com/flatpickr/dist/flatpickr.min.js'
    },
    {
      src: 'https://npmcdn.com/flatpickr/dist/l10n/pt.js'
    }
  ],
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: 'Seletor de Frutas',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { 
        rel: 'icon', 
        type: 'image/x-icon', 
        href: '/favicon.ico' 
      },
      { 
        rel: 'stylesheet', 
        href: 'https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700'
      },
      { 
        rel: 'stylesheet', 
        href: 'https://use.fontawesome.com/releases/v5.6.3/css/all.css', 
        integrity: "sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/", 
        crossorigin: "anonymous"
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Nunito:400,900',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Roboto+Slab:400,700',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Montserrat',
      },
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    'assets/css/nucleo/css/nucleo.css',
    'assets/sass/argon.scss'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/dashboard-plugin',
    { src: '~/plugins/axios', ssr: true },
    // {src: '~/plugins/dashboard/full-calendar', ssr: false },
    // {src: '~/plugins/dashboard/world-map', ssr: false },
    { src: '~/plugins/BootstrapVue', ssr: false },
    { src: '~/plugins/fireinit', ssr: true },
    { src: '~/plugins/fireauth', ssr: true },
    { src: '~/plugins/vue-lazy', ssr: false },
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    'bootstrap-vue/nuxt',
    [
      'nuxt-env',
      {
        keys: [
          { key: 'FIREBASE_API_KEY', default: process.env.FIREBASE_API_KEY },
          { key: 'FIREBASE_AUTH_DOMAIN', default: process.env.FIREBASE_AUTH_DOMAIN },
          // { key: 'FIREBASE_DATABASE_URL', default: 'change-me' },
          { key: 'FIREBASE_PROJECT_ID', default: process.env.FIREBASE_PROJECT_ID }
        ],
      },
    ],
    ['cookie-universal-nuxt', { alias: 'cookiz', parseJSON: true }],
  ],

  router: {
    middleware: 'check-auth',
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {

    },
    extractCSS: process.env.NODE_ENV === 'production',
    babel: {
      plugins: [
        [
          "component",
          {
            "libraryName": "element-ui",
            "styleLibraryName": "theme-chalk"
          }
        ]
      ]
    }
  }
}
