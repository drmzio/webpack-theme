const path = require('path');
const isdev = require('isdev');
const webpack = require('webpack');
const glob = require('glob-all');

const CopyPlugin = require('copy-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const { default: ImageminPlugin } = require('imagemin-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const PurgeCssPlugin = require('purgecss-webpack-plugin');
const NotifierPlugin = require('webpack-notifier');

const vueRule = require('./build/rules/vue');
const sassRule = require('./build/rules/sass');
const fontsRule = require('./build/rules/fonts');
const imagesRule = require('./build/rules/images');
const javascriptRule = require('./build/rules/javascript');
const externalFontsRule = require('./build/rules/external.fonts');
const externalImagesRule = require('./build/rules/external.images');

const config = require('./app.config');

module.exports = {
  /**
   * Should the source map be generated?
   *
   * @type {string|undefined}
   */
  devtool: (isdev && config.settings.sourceMaps) ? 'source-map' : undefined,

  /**
   * Application entry files for building.
   *
   * @type {Object}
   */
  entry: config.assets,

  /**
   * Output settings for application scripts.
   *
   * @type {Object}
   */
  output: {
    path: config.paths.public,
    filename: config.outputs.javascript.filename,
    chunkFilename: config.outputs.javascript.chunkFilename
  },

  /**
   * External objects which should be accessible inside application scripts.
   *
   * @type {Object}
   */
  externals: config.externals,

  /**
   * Custom modules resolving settings.
   *
   * @type {Object}
   */
  resolve: config.resolve,

  /**
   * Performance settings to speed up build times.
   *
   * @type {Object}
   */
  performance: {
    hints: false
  },

  optimization: {
    runtimeChunk: {
      name: 'manifest'
    },
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: new RegExp(`(?<!node_modules.*)[\\\\/]node_modules[\\\\/](${config.extract.join('|')})[\\\\/]`, 'i'),
          name: 'vendor',
          chunks: 'all',
          enforce: true
        }
      }
    }
  },

  /**
   * Performance settings to speed up build times.
   *
   * @type {Object}
   */
  mode: isdev ? 'development' : 'production',

  /**
   * Build rules to handle application assset files.
   *
   * @type {Object}
   */
  module: {
    rules: [
      vueRule,
      sassRule,
      fontsRule,
      imagesRule,
      javascriptRule,
      externalFontsRule,
      externalImagesRule,
    ]
  },

  /**
   * Common plugins which should run on every build.
   *
   * @type {Array}
   */
  plugins: [
    new webpack.LoaderOptionsPlugin({ minimize: !isdev }),
    new MiniCssExtractPlugin(config.outputs.css),
    new CleanPlugin(),
    new CopyPlugin([{
      context: config.paths.images,
      from: {
        glob: `${config.paths.images}/**/*`,
        flatten: true,
        dot: false
      },
      to: config.outputs.image.filename,
    }]),
    new ManifestPlugin(),
    new NotifierPlugin(config.settings.notifier)
  ]
};

/**
 * Adds Stylelint plugin if
 * linting is configured.
 */
if (config.settings.styleLint) {
  module.exports.plugins.push(
    new StyleLintPlugin(config.settings.styleLint)
  )
}

/**
 * Adds BrowserSync plugin when
 * settings are configured.
 */
if (config.settings.browserSync) {
  module.exports.plugins.push(
    new BrowserSyncPlugin(config.settings.browserSync, {
      // Prevent BrowserSync from reloading the page
      // and let Webpack Dev Server take care of this.
      reload: false
    })
  )
}

/**
 * Adds optimization plugins when
 * generating production build.
 */
if (! isdev) {
  module.exports.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    })
  );

  module.exports.plugins.push(
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      optipng: { optimizationLevel: 7 },
      gifsicle: { optimizationLevel: 3 },
      pngquant: { quality: '65-90', speed: 4 },
      svgo: { removeUnknownsAndDefaults: false, cleanupIDs: false }
    })
  );

  module.exports.plugins.push(
    new PurgeCssPlugin({
      paths: glob.sync([
        path.join(config.paths.root, 'pages/**/*.htm'),
        path.join(config.paths.root, 'layouts/**/*.htm'),
        path.join(config.paths.root, 'partials/**/*.htm'),
      ], { nodir: true }),
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
    })
  );
}
