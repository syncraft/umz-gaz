module.exports = {
  head: {
    titleTemplate: 'УМЗ - %s',
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
      'socket.io-client',
      'transliteration',
      'moment',
      'url',
      'vue-the-mask'
    ]
  },

  loading: {
    color: 'rgb(200, 0, 0)',
    height: '4px'
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
    '~/plugins/socket',
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
    },

    middleware: [
      'fetch'
    ]
  }
}
