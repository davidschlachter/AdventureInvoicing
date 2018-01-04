var webpack = require('webpack');

var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
  __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false'))
});
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
module.exports = {
  cache: true,
  entry: {      main:  './views/index.jsx'   },
  output: {    path: 'public/build',        filename: '[name].js'    },
  module: {
    loaders: [
      {test: /\.jsx?$/, loader: 'babel', exclude: /(node_modules|bower_components)/, query: { presets: ['react', 'es2015'] }},
      {test: /\.json$/, exclude: /(node_modules|bower_components)/, loader: "json"},
      {test: /\.css$/, loader: "style-loader"},
      {test: /\.css$/, loader: 'css-loader', query: { modules: false/*, localIdentName: '[name]__[local]___[hash:base64:5]'*/ }}
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    definePlugin,
    commonsPlugin
  ],
  //    node: {
  //        fs: "empty",
  //        net: "empty",
  //        tls: "empty"
  //    }
};