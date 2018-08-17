const path = require ('path');
const HtmlWebpackPlugin = require ('html-webpack-plugin');
const htmlWebpackPlugin = new HtmlWebpackPlugin ({
  template: path.join (__dirname, 'src/index.html'),
  filename: './index.html',
});

module.exports = {
  entry: {app: path.join (__dirname, 'src/index.js')},
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [htmlWebpackPlugin],
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      'react-cover-carousel': path.resolve(__dirname, '../lib/react-cover-carousel.js')
    },
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve (__dirname, 'dist'),
  },
};
