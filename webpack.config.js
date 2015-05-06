var webpack = require('webpack');

module.exports = {
  entry: "./example/app.js",
  output: {
    path: __dirname + '/build',
    filename: "app.js"
  },

  module: {
    loaders: [
//      { test: /\.json$/, loader: 'json-loader' },
//      { test: /\.js$/, loader: 'jsx-loader?harmony' }
    ]
  },

  plugins: [
//    new webpack.optimize.CommonsChunkPlugin('shared.js')
  ]
}
