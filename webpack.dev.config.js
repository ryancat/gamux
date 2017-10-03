import webpack from 'webpack'
import path from 'path'

export default [{
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
  devServer: {
    contentBase: path.resolve(__dirname)
  },
  module: {
    loaders: [
      {test: /\.js$/, include: path.join(__dirname, 'src'), loaders: ['babel-loader']},
      {test: /(\.scss)$/, include: path.join(__dirname, 'src'), loaders: ['style-loader', 'css-loader', 'sass-loader']}
    ]
  }
}, {
  name: 'source',
  devtool: 'inline-source-map',
  entry: [
    path.resolve(__dirname, 'src/gamux.js')
  ],
  target: 'web',
  output: {
    path: __dirname + '/dist', // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: '/',
    filename: 'gamux.js'
  },
  devServer: {
    contentBase: path.resolve(__dirname)
  },
  module: {
    loaders: [
      {test: /\.js$/, include: path.join(__dirname, 'src'), loaders: ['babel-loader']}
    ]
  }
}]