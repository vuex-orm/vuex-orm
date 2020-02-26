const path = require('path')
const nodeResolve = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const replace = require('@rollup/plugin-replace')

const resolve = _path => path.resolve(__dirname, '../', _path)

const configs = {
  umdDev: {
    input: resolve('lib/index.cjs.js'),
    file: resolve('dist/vuex-orm.js'),
    format: 'umd',
    env: 'development'
  },
  umdProd: {
    input: resolve('lib/index.cjs.js'),
    file: resolve('dist/vuex-orm.min.js'),
    format: 'umd',
    env: 'production'
  },
  commonjs: {
    input: resolve('lib/index.cjs.js'),
    file: resolve('dist/vuex-orm.common.js'),
    format: 'cjs',
    env: 'production'
  },
  esm: {
    input: resolve('lib/index.js'),
    file: resolve('dist/vuex-orm.esm.js'),
    format: 'es',
    env: 'production'
  }
}

function genConfig (opts) {
  const config = {
    input: {
      input: opts.input,

      plugins: [
        nodeResolve(),
        commonjs()
      ],

      onwarn (warning) {
        if (warning.code === 'THIS_IS_UNDEFINED') {
          return
        }

        if (warning.code === 'CIRCULAR_DEPENDENCY') {
          return
        }

        console.error(warning.message)
      }
    },

    output: {
      name: 'VuexORM',
      file: opts.file,
      format: opts.format
    }
  }

  if (opts.env) {
    config.input.plugins.unshift(replace({
      'process.env.NODE_ENV': JSON.stringify(opts.env)
    }))
  }

  return config
}

function mapValues (obj, fn) {
  const res = {}

  Object.keys(obj).forEach(key => {
    res[key] = fn(obj[key], key)
  })

  return res
}

module.exports = mapValues(configs, genConfig)
