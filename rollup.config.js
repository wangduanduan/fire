import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import pkg from './package.json'

export default [{
  input: 'src/main.js',
  external: ['axios'],
  output: {
    name: 'xfire',
    file: pkg.browser,
    format: 'umd',
    globals: {
      axios: 'axios'
    }
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**'
    })
  ]
},
{
  input: 'src/main.js',
  external: ['axios'],
  output: [{
    file: pkg.main,
    format: 'cjs'
  },
  {
    file: pkg.module,
    format: 'es'
  }
  ]
}
]
