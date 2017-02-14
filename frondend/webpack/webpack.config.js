var path = require("path");
var webpack = require('webpack');

var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

var mode = process.env.NODE_ENV;

if (mode === 'production') {
    baseUrl = "/static/"
} else {
    baseUrl = "http://localhost:8080/";
}

module.exports = {
    entry: path.resolve(__dirname, '../app/main.js'),
    output: {
        path: path.resolve(__dirname, '../build'),
        filename: 'build/build.js'
    },

    resolve: {
        alias: {
          'vue$': 'vue/dist/vue.common.js'
        },
        extensions: ['', '.js', '.jsx']
    },

    devtool: 'eval-source-map',
    
    plugins: [
      //把指定文件夹下的文件复制到指定的目录
      new HtmlWebpackPlugin({
        alwaysWriteToDisk: true,
        template: './frondend/index.html',
        filename: path.resolve(__dirname, '../../backend/templates/index.html'),
        inject: false,
        jspath:baseUrl+'build/build.js'
      }),
      new CopyWebpackPlugin(
        [{from:path.resolve(__dirname, '../build'),to:path.resolve(__dirname, '../../backend/static')}]
      ),
      new HtmlWebpackHarddiskPlugin()
    ],

    module: {
        loaders: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        }, {
          test: /\.css$/,
          loader: 'style-loader!css-loader'
        }, {
          test: /\.less$/,
          loader: 'style!css!less'
        },{
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'file-loader?publicPath='+baseUrl
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
        loader: 'file-loader?publicPath='+baseUrl,
        query: {
          name: '[name].[ext]?[hash]'
        }
      }]
    },
    babel: {
     presets: ['es2015','stage-0'],
     plugins: ['transform-runtime',["component", [
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-default"
      }]]]
    },

    devServer: {
      contentBase: './frondend',
      outputPath: path.join(__dirname, '../../backend/static/'),
      color: true,
      historyApiFallback: true,
      inline: true,
      hot: true,
      debug: true,
      headers: { "Access-Control-Allow-Origin": "*" }
  }
};

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    // new webpack.LoaderOptionsPlugin({
    //   minimize: true
    // })
  ])
}