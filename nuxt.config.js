/*!

 =========================================================
 * Nuxt Black Dashboard - v1.0.0
 =========================================================

 * Product Page: https://www.creative-tim.com/product/nuxt-black-dashboard
 * Copyright 2020 Creative Tim (https://www.creative-tim.com)

 * Coded by Creative Tim

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */
export default {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Nuxt Black Dashboard',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Poppins:200,300,400,600,700,800'},
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.2/css/all.min.css'}
    ],
    bodyAttrs: {
      class: '' // Add `white-content` class here to enable "white" mode.
    }
  },
  router: {
    linkExactActiveClass: 'active',
    middleware: ["auth", "healthcheck"]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [
    'assets/css/demo.css',
    'assets/css/nucleo-icons.css',
    'assets/sass/black-dashboard.scss'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    `~/plugins/dashboard-plugin.js`,
    { src: '~plugins/vue-full-calendar.js', ssr: false},
    { src: '~plugins/vue-slider-bar.js', ssr: false },
    { src: '~plugins/vue-plyr.js', ssr: false },
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/pwa',
    'nuxt-i18n',
    '@nuxt/http',
    '@nuxtjs/proxy',
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    'cookie-universal-nuxt'
  ],
  http: {

  },
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      pathRewrite: {
        '^/localhost' : '/'
        }
      }
  },
  i18n: {
    locales: [
      {
        code: 'en',
        file: 'en.js'
      },
      {
        code: 'ar',
        file: 'ar.js'
      }
    ],
    lazy: true,
    langDir: 'lang/',
    defaultLocale: 'en',
  },
  auth: {
    localStorage: false,
    cookie: {
      prefix: 'auth.',
      options: {
        path: '/',
        maxAge: 10800
      },
      token: {
        prefix: '_NUXTJS_token.'
      }
    },
    strategies: {
      google: {
        clientId: '601781692092-0589uerlrtj0ms315ek0b4f91uupgtvi.apps.googleusercontent.com',
        codeChallengeMethod: '',
        responseType: 'code',
        endpoints: {
          //token: 'http://localhost:8000/social_login/google/',
          token: 'http://localhost:8000/dj-rest-auth/google/',
          //userInfo: 'http://localhost:8000/auth/user/'
          userInfo: 'http://localhost:8000/dj-rest-auth/user/'
        },
        token: {
          property: 'access_token',
          type: 'Bearer',
          maxAge: 18000
        },
        refreshToken: {
          property: 'refresh_token',
          maxAge: 60 * 60 * 24 * 30
        },
        redirect: {
          login: '/login',
          logout: '/',
          callback: '/login',
          home: '/'
        },
      }
    },
    env: {
      mescouilles: process.env.MESCOUILLES || 'petites couilles',
      dev: process.env.NODE_ENV !== 'production',
      baseUrl: process.env.BASE_URL || 'localhost:8000'
    }
  },
  /*
  ** Build configuration
  */
  build: {
    transpile: [/^element-ui/],
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    },
    babel: {
      plugins: [
        [
          'component',
          {
            'libraryName': 'element-ui',
            'styleLibraryName': 'theme-chalk'
          }
        ]
      ]
    }
  }
}
