import webpack from 'webpack';
import prodConfig from '../webpack.prod.config';
import fs from 'fs';

/* eslint-disable no-console */
const compiler = webpack(prodConfig);

compiler.run((err, stats) => {
  if (err) {
    console.log(err);
  }
  else {
    console.log(stats.toString());
  }
})