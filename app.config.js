const path = require('path');
const merge = require('webpack-merge');

const env = require('./build/utils/env');
const config = require('./app');

module.exports = merge({
  /**
   * Project paths.
   *
   * @type {Object}
   */
  paths: {
    root: path.resolve(__dirname, './'),
    public: path.resolve(__dirname, './assets/public'),
    sass: path.resolve(__dirname, './assets/resources/sass'),
    fonts: path.resolve(__dirname, './assets/resources/fonts'),
    images: path.resolve(__dirname, './assets/resources/images'),
    javascript: path.resolve(__dirname, './assets/resources/js'),
    relative: './',
    external: /node_modules|bower_components/
  },

  /**
   * Collection of application front-end assets.
   *
   * @type {Array}
   */
  assets: [],

  /**
   * List of filename schemas for different
   * application assets.
   *
   * @type {Object}
   */
  outputs: {
    css: {
      filename: env('FILENAME_CSS', 'css/[name].css')
    },

    font: {
      filename: env('FILENAME_FONT', 'fonts/[name].[ext]')
    },

    image: {
      filename: env('FILENAME_IMAGE', 'images/[path][name].[ext]')
    },

    javascript: {
      filename: env('FILENAME_JAVASCRIPT', 'js/[name].js'),
      chunkFilename: env('HASHFILENAME_JAVASCRIPT', 'js/[name].js')
    },

    external: {
      image: {
        filename: env('FILENAME_EXTERNAL_IMAGE', 'images/[name].[ext]')
      },
      font: {
        filename: env('FILENAME_EXTERNAL_FONT', 'fonts/[name].[ext]')
      }
    }
  },

  /**
   * List of libraries which will be provided
   * within application scripts as external.
   *
   * @type {Object}
   */
  externals: {
    jquery: 'jQuery',
  },

  /**
   * List of libraries which will be extracted
   *
   * @type {Array}
   */
  extract: [
    'vue', 'vue-router'
  ],

  /**
   * List of custom modules resolving.
   *
   * @type {Object}
   */
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },

  /**
   * Settings of other build features.
   *
   * @type {Object}
   */
  settings: {
    //sourceMaps: env('SOURCEMAPS', true),
    sourceMaps: false,
    styleLint: {
      context: 'assets/resources'
    },
    browserSync: {
      host: env('BROWSERSYNC_HOST', 'localhost'),
      port: env('BROWSERSYNC_PORT', 3000),
      proxy: env('BROWSERSYNC_PROXY', 'http://localhost:8080/'),
      open: env('BROWSERSYNC_OPEN', false),
      reloadDelay: env('BROWSERSYNC_DELAY', 500),
      files: [
        '*.php',
        'pages/**/*.php',
        'layouts/**/*.php',
        'partials/**/*.php',
        //'resources/templates/**/*.php',
        'assets/resources/js/**/*.js',
        'assets/resources/sass/**/*.{sass,scss}',
        'assets/resources/images/**/*.{jpg,jpeg,png,gif,svg}',
        'assets/resources/fonts/**/*.{eot,ttf,woff,woff2,svg}'
      ]
    },
    notifier: {
      title: 'Webpack',
      contentImage: path.join(__dirname, 'build/webpack.png'),
      excludeWarnings: false
    }
  }
}, config);
