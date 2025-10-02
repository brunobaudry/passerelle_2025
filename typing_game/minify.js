const minify = require('@node-minify/core');
const uglifyES = require('@node-minify/uglify-js');
const crass = require('@node-minify/crass');
const htmlMinifier = require('@node-minify/html-minifier');

minify({
  compressor: uglifyES,
  input: 'static/js/typing_game.js',
  output: 'static/js/typing_game.min.js',
  callback: function(err, min) {
    console.log('error: ' + err);
  }
});
minify({
  compressor: crass,
  input: 'static/css/style.css',
  output: 'static/css/style.min.css',
  callback: function(err, min) {console.log('error: ' + err);}
});
minify({
  compressor: htmlMinifier,
  input: 'static/img/heart.svg',
  output: 'static/img/heart.min.svg',
  options: {
    removeAttributeQuotes: true
  },
  callback: function(err, min) {}
});