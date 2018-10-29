const path = require('path')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const isCoverage = process.env.NODE_ENV === 'coverage'

const rootDir = path.join(__dirname, '..')

module.exports = {
  mode: 'development',

  target: 'node',

  devtool: 'inline-cheap-module-source-map',

  module: {
    rules: [].concat(
      isCoverage ? {
        test: /\.(js|ts)/,
        include: path.resolve(rootDir, 'src'),
        loader: 'istanbul-instrumenter-loader',
        query: {
          esModules: true
        }
      } : [],
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          path.resolve(rootDir, 'src'),
          path.resolve(rootDir, 'test')
        ],
        options: {
          cacheDirectory: true
        }
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        include: path.resolve(rootDir, 'src'),
        options: {
          transpileOnly: true
        }
      }
    )
  },

  resolve: {
    alias: {
      app: path.resolve(rootDir, 'src'),
      test: path.resolve(rootDir, 'test')
    },
    extensions: ['.js', '.ts']
  },

  plugins: [
    new ForkTsCheckerWebpackPlugin({
      tsconfig: path.resolve(rootDir, 'tsconfig.json'),
      watch: [path.resolve(rootDir, 'src')]
    })
  ]
}
