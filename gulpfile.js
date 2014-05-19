'use strict';

/**
 * Dependencies.
 */
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var npmcss = require('npm-css');
var CleanCSS = require('clean-css');

/**
 * Create build directory
 */
mkdirp('./build');

/**
 * Browserify task
 */
gulp.task('browserify', function() {
  var file = path.resolve('index.js');
  browserify(file)
    .require(file, {'expose': 'modal'})
    .transform({'global': true}, 'jadeify')
    .transform({'global': true}, 'uglifyify')
    .bundle({
      'debug': false
    })
    .pipe(source('build.js'))
    .pipe(gulp.dest('./build/'));
});

/**
 * npmcss task
 */
gulp.task('npmcss', function() {
  var file = path.resolve('index.css');
  var output = fs.createWriteStream('build/build.css');
  var linked = npmcss(file);
  var minified = new CleanCSS().minify(linked);
  output.write(minified);
  output.end();
});

/**
 * Build task
 */
gulp.task('build', ['browserify', 'npmcss']);
