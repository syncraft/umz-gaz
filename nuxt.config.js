module.exports = {
  head: {
    titleTemplate: (title) => {
      return title ? `${title} - Ульяновский моторный завод` : 'Ульяновский моторный завод';
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  css: [
    '~/assets/styles/global.scss'
  ],

  build: {
    extractCSS: true,
    
    extend (config, { isDev, isClient }) {
      config.resolve.alias['vue'] = 'vue/dist/vue.esm';

      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        });
      }
    },

    vendor: [
      'babel-polyfill',
      'socket.io-client',
      'moment',
      'url',
      'vue-the-mask',
      'slugify'
    ]
  },

  loading: {
    color: 'rgb(200, 0, 0)',
    height: '3px'
  },

  modules: [
    '~/modules/backend'
  ],

  // Dirty trick to bypass Nuxt "bug" that sometimes ignoring 'listen' hooks
  // This undocumented hooks triggered before 'Nuxt.listen()'
  hooks: {
    listen(server) {
      require('./modules/backend/socket')(server);
    }
  },

  plugins: [
    '~/plugins/vuex-router-sync',
    '~/plugins/socket',
    '~/plugins/prefetch',
    {
      src: '~/plugins/nuxt-client-init.js',
      ssr: false
    }
  ],

  router: {
    scrollBehavior: function() {
      return { x: 0, y: 0 }
    },

    extendRoutes (routes, resolve) {
      routes.push({
        path: '*',
        component: resolve(__dirname, 'pages/article.vue')
      })
    }
  }
}
