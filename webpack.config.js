const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')
const ProgressPlugin = require('webpack/lib/ProgressPlugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const autoprefixer = require('autoprefixer')
const postcssUrl = require('postcss-url')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {NoEmitOnErrorsPlugin, LoaderOptionsPlugin} = require('webpack')
const { IgnorePlugin } = require('webpack')
const { AngularWebpackPlugin } = require('@ngtools/webpack')
const entryPoints = ['inline', 'polyfills', 'sw-register', 'styles', 'vendor', 'main']
const baseHref = ''
const deployUrl = ''
const linkerPlugin = '@angular/compiler-cli/linker/babel'

const optionalPlugins = []
if (process.platform !== "darwin") {
  optionalPlugins.push(new IgnorePlugin({ resourceRegExp: /^fsevents$/ }));
}
module.exports = {
  mode: 'development',
  'target': 'electron-renderer',
  'devtool': 'source-map',
  'resolve': {
    'extensions': [
      '.ts',
      '.js'
    ],
    'modules': [
      './node_modules'
    ],
    fallback: {
      fs: false,
      http: false,
      crypto: false,
      tls: false,
      net: false,
      process: false,
      module: false,
      clearImmediate: false,
      setImmediate: false,
      Buffer: false,
    }
  },
  'resolveLoader': {
    'modules': [
      './node_modules'
    ]
  },
  'entry': {
    'main': [
      './src/main.ts'
    ],
    'polyfills': [
      './src/polyfills.ts'
    ],
    'styles': [
      './src/styles.css'
    ]
  },
  'output': {
    'path': path.join(process.cwd(), 'dist'),
    'filename': '[name].bundle.js',
    'chunkFilename': '[id].chunk.js'
  },
  'module': {
    // Disable handling of requires with a single expression
    exprContextRegExp: /$^/,
    exprContextCritical: false,
    // Disable handling of requires with expression wrapped by string,
    wrappedContextRegExp: /$^/,
    wrappedContextCritical: false,
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: /\/node_modules\//
      },
      {
        test: /\.html$/,
        loader: 'raw-loader'
      },
      {
        test: /.node$/,
        loader: 'node-loader',
      },
      {
        test: /\.(jpg|png|gif|otf|cur|ani)$/,
        use:[
          {
            loader: 'url-loader',
            options: {
              name : '[name].[hash:20].[ext]',
              limit: 10000
            }
          }
        ]

      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.[cm]?js$/,
        use: {
          loader: 'babel-loader',
          options: {
            compact: false,
            plugins: [linkerPlugin],
          }
        },
      },
      {
        exclude: path.join(process.cwd(), 'src/styles.css'),
        type: 'javascript/auto',
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: 'css-loader',
            options: {
              url: true,
              sourceMap: false,
              importLoaders: 1
            }
          },
          'postcss-loader',
        ]
      },
      {
        exclude: path.join(process.cwd(), 'src/styles.css'),
        type: 'javascript/auto',
        test: /\.scss$|\.sass$/,
        use: [
          "style-loader",
          {
            loader: 'css-loader',
            options: {
              url: true,
              sourceMap: false,
              importLoaders: 1
            }
          },
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        exclude: path.join(process.cwd(), 'src/styles.css'),
        type: 'javascript/auto',
        test: /\.less$/,
        use: [
          "style-loader",
          {
            loader: 'css-loader',
            options: {
              url: true,
              sourceMap: false,
              importLoaders: 1
            }
          },
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        exclude: path.join(process.cwd(), 'src/styles.css'),
        type: 'javascript/auto',
        test: /\.styl$/,
        use: [
          "style-loader",
          {
            loader: 'css-loader',
            options: {
              url: true,
              sourceMap: false,
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
          },
          'stylus-loader?{"sourceMap":false,"paths":[]}'
        ]
      },
      {
        include: path.join(process.cwd(), 'src/styles.css'),
        type: 'javascript/auto',
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              url: true,
              importLoaders: 1,
            }
          },
          {
            loader: 'postcss-loader',
          },
        ]
      },
      {
        include: path.join(process.cwd(), 'src/styles.css'),
        type: 'javascript/auto',
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              url: true,
              importLoaders: 1,
            }
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: "sass-loader", // compiles SCSS to CSS
          },
        ]
      },
      {
        include: path.join(process.cwd(), 'src/styles.css'),
        type: 'javascript/auto',
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              url: true,
              importLoaders: 1,
            }
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: "less-loader", // compiles Less to CSS
          },
        ]
      },
      {
        include: path.join(process.cwd(), 'src/styles.css'),
        type: 'javascript/auto',
        test: /\.styl$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              url: true,
              importLoaders: 1,
            }
          },
          {
            loader: 'postcss-loader',
          },
        ]
      },
      {
        test: /\.[jt]sx?$/,
        loader: '@ngtools/webpack',
      },
    ]
  },
  plugins: [
    ...optionalPlugins,
    new NoEmitOnErrorsPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {   context: __dirname + '/src',
          from: 'assets/**/*',
          to: __dirname + '/dist',
          noErrorOnMissing: true,
          globOptions: {
            dot: true,
            ignore: ['**/.gitkeep']
          }
        }
      ]
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          context: path.resolve(__dirname, 'src'),
          from: 'entry.js'
        },
      ]
    }),
    new ProgressPlugin(),
    new HtmlWebpackPlugin({
      'template': './src/index.html',
      'filename': './index.html',
      'base': '',
      'hash': false,
      'inject': true,
      'compile': true,
      'favicon': false,
      'minify': false,
      'cache': true,
      'showErrors': true,
      'chunks': 'all',
      'excludeChunks': [],
      'title': 'Webpack App',
      'xhtml': true,
      'chunksSortMode': function sort(left, right) {
        let leftIndex = entryPoints.indexOf(left)
        let rightIndex = entryPoints.indexOf(right)
        if (leftIndex > rightIndex) {
          return 1
        } else if (leftIndex < rightIndex) {
          return -1
        } else {
          return 0
        }
      }
    }),
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css'
    }),
    new LoaderOptionsPlugin({
      'sourceMap': false,
      'options': {
        'postcss': [
          autoprefixer(),
          postcssUrl({
            'url': (URL) => {
              // Only convert root relative URLs, which CSS-Loader won't process into require().
              if (!URL.startsWith('/') || URL.startsWith('//')) {
                return URL
              }
              if (deployUrl.match(/:\/\//)) {
                // If deployUrl contains a scheme, ignore baseHref use deployUrl as is.
                return `${deployUrl.replace(/\/$/, '')}${URL}`
              } else if (baseHref.match(/:\/\//)) {
                // If baseHref contains a scheme, include it as is.
                return baseHref.replace(/\/$/, '') +
                  `/${deployUrl}/${URL}`.replace(/\/\/+/g, '/')
              } else {
                // Join together base-href, deploy-url and the original URL.
                // Also dedupe multiple slashes into single ones.
                return `/${baseHref}/${deployUrl}/${URL}`.replace(/\/\/+/g, '/')
              }
            }
          })
        ],
        'sassLoader': {
          'sourceMap': false,
          'includePaths': []
        },
        'lessLoader': {
          'sourceMap': false
        },
        'context': __dirname + '/src'
      }
    }),
    new AngularWebpackPlugin({
      'mainPath': 'main.ts',
      'hostReplacementPaths': {
        'environments/environment.ts': 'environments/environment.ts'
      },
      exclude: [],
      'tsConfigPath': 'src/tsconfig.app.json',
      'sourceMap': false,
      'skipCodeGeneration': false
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  node: {
    global: false,
    __filename: false,
    __dirname: false
  }
}
