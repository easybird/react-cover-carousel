const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require ('path');
const pkg = require ('./package.json');

let libraryName = pkg.name;

module.exports = merge(common, {
  mode: 'production',
  output: {
    ...common.output,
    filename: libraryName + '.min.js',
  },
});