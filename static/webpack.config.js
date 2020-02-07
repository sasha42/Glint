const webpack = require('webpack');
const resolve = require('path').resolve;
//const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');
const dotenv = require('dotenv');

// call dotenv and it will return an Object with a parsed key 
const env = dotenv.config().parsed;
  
// reduce it to a nice object, the same as before
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

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
      test: /\.less$/,
      use: [{
        loader: 'style-loader',
      }, {
        loader: 'css-loader', // translates CSS into CommonJS
      }, {
        loader: 'less-loader', // compiles Less to CSS
        options: {
          modifyVars: {
            'ant-theme-file': "; @import '" + resolve(__dirname, './styles/glint.less') + "'",
          },
          javascriptEnabled: true,
        }
      }]
    },
	  {
      test: /\.js?/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      options: {
        presets: ['es2015', 'react'],
        plugins: [
          ['import', { libraryName: "antd", style: true }]
        ]
      },
    },
    {
      test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
      loader: require.resolve('url-loader'),
      options: {
        limit: 100000,
        name: 'static/media/[name].[hash:8].[ext]',
    }}]
  },
 plugins: [
//  new LodashModuleReplacementPlugin(),
//  new BundleAnalyzerPlugin(),
  new webpack.DefinePlugin(envKeys),
  new CompressionPlugin()
 ]
};

module.exports = config;
