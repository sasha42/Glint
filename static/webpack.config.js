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
  }
};

module.exports = config;
