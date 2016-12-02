'use strict';

const path = require('path');
const fs = require('fs');

const gulp = require('gulp');
const del = require('del');
const mergeStream = require('merge-stream');

gulp.task('clean-minify', function() {
  return del(['build/lrnw-min']);
});

gulp.task('cpoy-none-minify', ['clean-minify'], function() {
  return gulp.src(['**', '!node_modules', '!node_modules/**', '!**/build', '!**/build/**', '!**/Build', '!**/Build/**', '!ios', '!ios/**', '!android', '!android/**',
      '!Libraries', '!Libraries/**',// '!packager', '!packager/**',
    ])
    .pipe(gulp.dest('build/lrnw-min'));
});

// gulp.task('minify-packager', ['clean-minify', 'cpoy-none-minify'], function(cb) {
//   const babel = require('gulp-babel');
//   const uglify = require('gulp-uglify');
//   const pump = require('pump');
//   pump([
//     gulp.src(['packager/**/*.js',]),
//     babel({presets: ['es2015']}),
//     uglify(),
//     gulp.dest('build/lrnw-min/packager')],
//     cb);
// });

gulp.task('minify', ['clean-minify', 'cpoy-none-minify'], function() {
  const folders = ['Libraries',];
  const rnMinifyGulp = require('./rn-minify-gulp');
  let tasks = folders.map((folderName) => {
    return gulp.src([folderName + '/**'])
      .pipe(rnMinifyGulp())
      .pipe(gulp.dest('build/lrnw-min/' + folderName))
  });
  return mergeStream(tasks);
});
