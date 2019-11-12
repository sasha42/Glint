const webpack = require('webpack');
const resolve = require('path').resolve;

const config = {
 devtool: 'eval-source-map',
 entry: __dirname + '/js/index.js',
 output:{
      path: resolve('../public'),
      filename: 'bundle.js',
      publicPath: resolve('../public')
},

 resolve: {
  extensions: ['.js','.jsx','.css']
 },
 module: {
  rules: [
	  {
	   test: /\.jsx?/,
	   loader: 'babel-loader',
	   exclude: /node_modules/,
       query: {
           presets: ['es2015', 'react']
        }
    },
    {
      test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
      loader: require.resolve('url-loader'),
      options: {
        limit: 100000,
        name: 'static/media/[name].[hash:8].[ext]',
    }},
    {
      test: /\.css$/,
      loader: 'style-loader!css-loader?modules'
    }]
  }
};

module.exports = config;
