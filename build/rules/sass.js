const isdev = require('isdev');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = require('../../app.config');

/**
 * Internal application SASS files.
 * Have build-in autoprefixing.
 */
module.exports = {
  test: /\.s[ac]ss$/,
  include: config.paths.sass,
  use: [
    {
      loader: MiniCssExtractPlugin.loader
    },
    {
      loader: 'css-loader',
      options: {
        sourceMap: isdev
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        indent: 'postcss',
        plugins: [
          require('tailwindcss'),
          require('autoprefixer')
        ]
      }
    },
    {
      loader: 'sass-loader',
      options: {
        sourceMap: true
      }
    },
  ]
};
