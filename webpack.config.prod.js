/* eslint-disable indent */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

const sourceDir = path.join(__dirname, './app');

const entryPath = path.join(sourceDir, './index.js');

const { NODE_ENV = 'production' } = process.env;

module.exports = require('./webpack.config.base')({
  mode: 'production',
  devtool: 'source-map',

  entry: {
    main: entryPath,
  },

  output: {
    filename: '[name]-[hash:4].js',
    chunkFilename: '[name]-[chunkhash:4].js',
  },

  optimization: {
    namedModules: true,
    splitChunks: {
      name: 'common',
      minChunks: 3,
    },
    noEmitOnErrors: true,
    minimizer: [
      // in some cases we may want to try to run prod build without the uglifyer
      // for debugging purposes only
      NODE_ENV === 'production'
        ? new ParallelUglifyPlugin({
            sourceMap: process.env.SOURCEMAPS === 'true',
            workerCount: 4,
            cacheDir: path.join(__dirname, '../.uglify-cache'),
            uglifyES: {
              compress: {
                warnings: false,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true,
              },
              output: {
                comments: false,
              },
            },
          })
        : null,

      new OptimizeCSSAssetsPlugin({}),
      // remove null plugins
    ].filter(Boolean),
  },

  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'static/[name].[hash:4].css',
      chunkFilename: '[id].css',
    }),

    new SWPrecacheWebpackPlugin({
      cacheId: 'budgeting-app',
      filename: 'sw.js',
      maximumFileSizeToCacheInBytes: 800000,
      mergeStaticsConfig: true,
      minify: true,
      runtimeCaching: [
        {
          handler: 'cacheFirst',
          urlPattern: /(.*?)/,
        },
      ],
    }),

    new HtmlWebpackPlugin({
      template: 'index.prod.ejs',
      inject: true,
      production: true,
      preload: ['*.css'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),

    // make sure script tags are async to avoid blocking html render
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'async',
      preload: {
        test: /^main.*$/,
        chunks: 'all',
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        include: sourceDir,
        use: {
          loader: 'file-loader',
          query: {
            name: 'static/[name]-[hash:5].[ext]',
          },
        },
      },
      {
        test: /\.scss$/,
        include: [sourceDir],
        use: [
          MiniCssExtractPlugin.loader,
          'cache-loader',
          {
            loader: 'css-loader',
            options: {
              module: true,
              localIdentName: '[hash:base64:5]',
              importLoaders: 2,
              context: sourceDir,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: false,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              outputStyle: 'collapsed',
              sourceMap: false,
              includePaths: [sourceDir, path.resolve(sourceDir, '../')],
            },
          },
        ],
      },
      {
        test: /\.(js)$/,
        include: [sourceDir],
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: path.join(__dirname, '.babel-cache', 'production'),
            },
          },
        ],
      },
    ],
  },
});