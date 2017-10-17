const path = require('path')
const nodeExternals = require('webpack-node-externals')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const isCoverage = process.env.NODE_ENV === 'coverage';

const rootDir = path.join(__dirname, '.')

module.exports = {
  target: 'node',

  devtool: 'inline-cheap-module-source-map',

  externals: [nodeExternals()],

  module: {
    loaders: [].concat(
      isCoverage ? {
        test: /\.(js|ts)/,
        include: `${rootDir}/src`,
        loader: 'istanbul-instrumenter-loader'
      } : [],
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: `${rootDir}/test`,
        exclude: /node_modules/,
        options: {
          cacheDirectory: true
        }
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        include: `${rootDir}/src`,
        exclude: /node_modules/,
        options: {
          transpileOnly: true
        }
      }
    )
  },

  resolve: {
    alias: {
      app: `${rootDir}/src`,
      test: `${rootDir}/test`
    },
    extensions: ['.js', '.ts']
  },

  plugins: [
    new ForkTsCheckerWebpackPlugin({
      tsconfig: `${rootDir}/tsconfig.json`,
      watch: [`${rootDir}/src`]
    })
  ]
}
