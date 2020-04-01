import path from 'path'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import ts from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'

const configs = [
  { input: 'src/index.ts', file: 'dist/vuex-orm.esm.js', format: 'es', browser: true, env: 'development' },
  { input: 'src/index.ts', file: 'dist/vuex-orm.esm.prod.js', format: 'es', browser: true, env: 'production' },
  { input: 'src/index.ts', file: 'dist/vuex-orm.esm-bundler.js', format: 'es', env: 'development' },
  { input: 'src/index.cjs.ts', file: 'dist/vuex-orm.global.js', format: 'iife', env: 'development' },
  { input: 'src/index.cjs.ts', file: 'dist/vuex-orm.global.prod.js', format: 'iife', minify: true, env: 'production' },
  { input: 'src/index.cjs.ts', file: 'dist/vuex-orm.cjs.js', format: 'cjs', env: 'development' }
]

function createEntries() {
  return configs.map((c) => createEntry(c))
}

function createEntry(config) {
  const c = {
    input: config.input,
    plugins: [],
    output: {
      file: config.file,
      format: config.format,
      globals: {
        vue: 'Vue'
      }
    },
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg)
      }
    }
  }

  if (config.format === 'iife') {
    c.output.name = 'VuexORM'
  }

  c.plugins.push(replace({
    __DEV__: config.format === 'es' && !config.browser
      ? `(process.env.NODE_ENV !== 'production')`
      : config.env !== 'production'
  }))

  c.plugins.push(resolve())
  c.plugins.push(commonjs())

  c.plugins.push(ts({
    check: config.format === 'es' && config.browser && config.env === 'development',
    tsconfig: path.resolve(__dirname, 'tsconfig.json'),
    cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache'),
    tsconfigOverride: {
      compilerOptions: {
        declaration: config.format === 'es' && config.browser && config.env === 'development',
        target: config.format === 'iife' || config.format === 'cjs' ? 'es5' : 'es2018'
      },
      exclude: ['test']
    }
  }))

  if (config.minify) {
    c.plugins.push(terser({ module: config.format === 'es' }))
  }

  return c
}

export default createEntries()
