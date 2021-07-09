const path = require('path')
const webpack = require('webpack')
var os = require('os')

const VueLoaderPlugin = require('vue-loader/lib/plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries')

const HtmlWebpackPlugin = require('html-webpack-plugin')

const colors = require('colors')

const packageJson = require('./package.json')

colors.setTheme({
  root: 'blue',
  error: 'red',
  ignored: 'magenta',
  format: 'cyan',
  pass: 'yellow',
  changed: 'green',
})

console.log(`v${packageJson.version.green}`.green)
console.log('--------------------')

if (typeof process.env.NODE_ENV === 'undefined') {
  process.env.NODE_ENV = 'development'
}

console.log(`${'NODE_ENV'.padStart(11, ' ')}: ${process.env.NODE_ENV}`.changed)

console.log('--------------------')

// 获取内网ip
function getIPAddress() {
  let IPAddress = ''
  var interfaces = os.networkInterfaces()
  for (var devName in interfaces) {
    var iface = interfaces[devName]
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i]
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        IPAddress = alias.address
      }
    }
  }
  return IPAddress
}

module.exports = {
  mode: 'development',
  entry: { gridBoard: './src/main.js' },
  output: {
    path: path.resolve(__dirname, './'),
    filename: '[name].js',
    // chunkFilename: '[name].bundle.js'
  },
  node: {
    __filename: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('dart-sass'),
            },
          },
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        include: [/src/],
        options: {
          compilerOptions: {
            preserveWhitespace: false,
          },
        },
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {},
        include: [/src/],
      },
      {
        test: /\.(gif|png|jpe?g|woff|svg|ttf|eot)$/,
        loader: 'url-loader',
        options: {
          limit: 4096,
          outputPath: 'images/',
          name: '[name].[ext]?[hash]',
          esModule: false,
        },
      },
      {
        enforce: 'pre',
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: [/(node_modules)/],
      },
      // {
      //   test: /\.(png|jpe?g|gif|svg)$/,
      //   loader: 'file-loader',
      //   options: {
      //     name: '[name].[ext]?[hash]',
      //   },
      // },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV,
      VERSION: packageJson.version,
    }),
    new FixStyleOnlyEntriesPlugin(),
  ],
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['*', '.ts', '.js', '.vue', '.json'],
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true,
    contentBase: './src',
    proxy: {},
    onListening: function (server) {
      const port = server.listeningApp.address().port
      console.log(`http://localhost:${port}/`.yellow)
      console.log(`http://${getIPAddress()}:${port}/`.yellow)
      console.log('--------------------')
    },
  },
  performance: {
    hints: false,
  },
  optimization: {
    splitChunks: {
      // chunks: 'all',
      // minSize: 0,
      // cacheGroups: {
      //   index: {
      //     name(module, chunks, cacheGroupKey) {
      //       return cacheGroupKey
      //     },
      //     test: (m, c, entry = 'one') => {
      //       return m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry
      //     },
      //     chunks: 'all',
      //     enforce: true,
      //     // filename: 'themes/[name]2.css',
      //   },
      //   one: {
      //     name(module, chunks, cacheGroupKey) {
      //       return cacheGroupKey
      //     },
      //     test: (m, c, entry = 'one') => {
      //       return m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry
      //     },
      //     chunks: 'all',
      //     enforce: true,
      //     // filename: 'themes/[name]2.css',
      //   },
      //   two: {
      //     name(module, chunks, cacheGroupKey) {
      //       return cacheGroupKey
      //     },
      //     test: (m, c, entry = 'two') => {
      //       return m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry
      //     },
      //     chunks: 'all',
      //     enforce: true,
      //   },
      // },
    },
  },
  node: {
    __filename: true,
  },
}

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'mock') {
  module.exports.output.publicPath = packageJson.publicPath
  module.exports.devtool = '#eval-source-map'
  module.exports.plugins = (module.exports.plugins || []).concat([
    new MiniCssExtractPlugin({
      filename: `[name].css`,
      hmr: true,
      esModule: true,
    }),
    new HtmlWebpackPlugin({
      title: 'Grid board Demo',
      filename: './index.html',
      template: './src/index.html',
      hash: true,
    }),
  ])
}

if (['production', 'analyzer'].includes(process.env.NODE_ENV)) {
  module.exports.output.publicPath = './'
  // module.exports.devtool = '#source-map'

  let entry = {
    gridBoard: './src/lib/index.js',
  }

  module.exports.entry = entry
  module.exports.output.path = path.resolve(__dirname, './dist')
  module.exports.mode = 'production'
  module.exports.output.library = process.env.SCOPE
  module.exports.output.libraryTarget = 'umd'
  module.exports.output.umdNamedDefine = true
  module.exports.output.globalObject = 'this'
  // module.exports.devtool = 'source-map'
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    new OptimizeCssAssetsPlugin(),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: `[name].css`,
      esModule: true,
    }),
  ])
  module.exports.optimization.minimize = false
  ;(module.exports.optimization.minimizer = [
    new TerserPlugin({
      extractComments: false,
      terserOptions: {
        cache: false,
        compress: {
          drop_debugger: true,
          drop_console: true,
        },
      },
    }),
  ]),
    (module.exports.externals = {
      vue: {
        root: 'Vue',
        commonjs: 'vue',
        commonjs2: 'vue',
        amd: 'vue',
      },
      // 'element-ui': 'element-ui',
      // echarts: 'echarts',
    })
}

if (process.env.NODE_ENV === 'analyzer') {
  module.exports.devtool = ''
  module.exports.plugins = (module.exports.plugins || []).concat([new BundleAnalyzerPlugin()])
}
