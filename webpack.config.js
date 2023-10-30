const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env) => ({
    mode: 'development',
    entry: { 
      index: env.debug === 'true' ? './src/index.debug.js' : './src/index.js'
    },
    devtool: 'inline-source-map',
    devServer: {
      static: './dist',
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Development',
      })
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true
    },
    optimization: {
      runtimeChunk: 'single',
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        }
      ],
    }
});