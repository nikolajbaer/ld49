const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = { 
  entry: './src/index.js', 
  mode: 'development',
  output: { 
    path: path.resolve(__dirname,'dist'), 
    filename: 'static/index_bundle.js?' + process.env.SOURCE_VERSION,
  }, 
  module: {
    rules: [
        {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader'
            ]
        },
        {
            test: /\.(mp3|png|jpg|jpeg|gif|pdf|fbx|glb)$/,
            use: [{
                loader: 'file-loader',
                options: {
                  outputPath: 'static'
                }
            }]
        },
        {
          test: /\.svg$/,
          type: 'asset/source',
        },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      title: 'Output Management',
      template: 'src/index.html',
      inject: true,
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    historyApiFallback: true,
    hot: true,
  }
}
