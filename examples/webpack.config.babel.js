import path from 'path';
import express from 'express';
import webpack from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';


export default (env, argv) => {
  return({
  entry: {
    index: './src/index.js',
    react_cover_carousel: './src/react_cover_carousel.js',

  },

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './public/bundle/'),
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: [ 'url-loader' ]
      }
    ]
  },

  externals: {
    'react-cover-carousel': 'window.ReactCoverCarousel',
    react: 'window.React',
    'react-dom': 'window.ReactDOM'
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(argv.mode || 'production'),
    }),
    new CopyWebpackPlugin([{ from: path.resolve(__dirname, '../build/*')}])
  ],

  devServer: {
    contentBase: './public',
    publicPath: '/build',
    port: 8080,
    before(app, server) {
      app.use('/build', express.static(path.resolve(__dirname, '../build/')))
    }
  }
})};
