const path = require('path');
//const fs = require('fs');
const webpack = require('webpack');
//const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'source-map',

    entry: [
        path.join(__dirname, '../app'),
    ],
    output: {
        path: path.join(__dirname, '../build'),
        filename: 'bundle.js',
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
          minimize: true,
          compress: {
              warnings: false
          }
        })
    ],
    module: {
        loaders: [{
          test: /.js$/,
          loader: 'babel-loader',
          include: path.join(__dirname, '../app'),
          exclude: /node_modules/,
          query: {
              presets: ['es2015', 'react']
          }
        }]
    }
};
