import webpack from 'webpack'
import path from 'path'

export default {
  entry: [
    path.resolve(__dirname, 'src/gamux.js')
  ],
  target: 'web',
  output: {
    path: __dirname + '/dist', // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: '/',
    filename: 'gamux.js'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      parallel: {
        cache: true,
        workers: 2
      }
    })
  ],
  module: {
    loaders: [
      {test: /\.js$/, include: path.join(__dirname, 'src'), loaders: ['babel-loader']}
    ]
  }
}