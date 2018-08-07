const path = require ('path');
const pkg = require ('./package.json');

let libraryName = pkg.name;

module.exports = {
  output: {
    path: path.resolve (__dirname, './lib'),
    filename: libraryName + '.js',
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: true,
              localIdentName: '[name]__[local]__[hash:base64:5]',
            },
          },
        ],
      },
    ],
  },
  externals: {
    // Don't bundle react or react-dom
    react: 'react',
    'react-dom': 'react-dom',
  },
};
