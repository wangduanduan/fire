import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import alias from 'rollup-plugin-alias'

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/index.js',
    format: 'es',
    name: 'Fire'
  },
  plugins: [
    alias({
      '@': 'src'
    }),
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**'
    })
  ]
}
