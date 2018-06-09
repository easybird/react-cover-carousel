import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import postcss from 'rollup-plugin-postcss';


export default {
  input: './src/index.js',
  moduleName: 'ReactCoverCarousel',
  sourcemap: true,

  // output: {
  //   file: './build/react-cover-carousel.js',
  //   format: 'umd',
  //   name: 'ReactCoverCarousel',
  //   sourcemap: true
  // },

  targets: [
    {
      dest: './build/react-cover-carousel.js',
      format: 'umd'
    },
    {
      dest: 'build/react-cover-carousel.module.js',
      format: 'es'
    }
  ],

  plugins: [
    postcss({
      modules: true
    }),
    babel({
      exclude: 'node_modules/**'
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    resolve(),
    commonjs()
  ],

  external: ['react', 'react-dom'],

  globals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  }
};
