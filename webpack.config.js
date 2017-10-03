const webpack = require('webpack'),
      path = require('path'),
      nodeEnv = process.NODE_ENV || 'DEV'

module.exports = [{
  name: 'source',
  devtool: 'inline-source-map',
  entry: [
    path.resolve(__dirname, 'src/gamux.js')
  ],
  target: 'web',
  output: {
    path: __dirname + '/dist', // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: '/',
    filename: 'gamux.js',
    library: 'gamux',
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'code': JSON.stringify(nodeEnv)
      }
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/, 
        include: path.join(__dirname, 'src'), 
        loaders: ['babel-loader']
      }
    ]
  }
}, {
  name: 'demo',
  devtool: 'inline-source-map',
  entry: {
    snake: path.resolve(__dirname, 'demo/snake/index.js')
  },
  target: 'web',
  output: {
    path: __dirname + '/demo/dist', // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: '/',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/, 
        include: path.join(__dirname, 'demo'), 
        loaders: ['babel-loader']
      },
      {
        test: /(\.scss)$/, 
        include: path.join(__dirname, 'demo'), 
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  }
}]