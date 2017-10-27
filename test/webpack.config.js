const path = require('path')
const nodeExternals = require('webpack-node-externals')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const isCoverage = process.env.NODE_ENV === 'coverage';

const rootDir = path.join(__dirname, '..')

module.exports = {
  target: 'node',

  devtool: 'inline-cheap-module-source-map',

  externals: [nodeExternals({
    whitelist: [/lodash-es/]
  })],

  module: {
    loaders: [].concat(
      isCoverage ? {
        test: /\.(js|ts)/,
        include: `${rootDir}/src`,
        loader: 'istanbul-instrumenter-loader',
        query: {
          esModules: true
        }
      } : [],
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          `${rootDir}/src`,
          `${rootDir}/test`,
        ],
        options: {
          cacheDirectory: true
        }
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        include: `${rootDir}/src`,
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
