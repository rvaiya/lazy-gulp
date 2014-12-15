var fs = require('fs');
var del = require('del');
var q = require('q');
var gulp = require('gulp');
var sass = require('gulp-sass');
var lg = require('lazy-gulp');
var angular = require('lg-angular-file-sort');

var styleGuide = ['src/style-guide/**/*'];
var sassFiles = ['src/scss/**/*.scss'];
var imgFiles = ['src/img/*'];
var htmlFiles = ['src/app/**/*html', 'src/index.html'];
var angularFiles = [
  'src/app/app.js',
  'src/app/components/**/*js',
  'src/app/core/**/*js',
  'src/app/sections/**/*js',
  '!src/app/**/*.test.js'
];

// =================================================================================
// Rule Sets
// =================================================================================

// Rules associate file sets (globs) with specific pipelines, the watch and
// build tasks then utilize these rules to perform the appropriate operations
// on files when they are being prepared (when the build task is run) and when
// a file maching one of the sets changes. Any file which does not match one of
// the rules is ignored this is desireable since it provides a single location
// to describe file transformations and also helps to enforce proper project
// structure.

var bldRules = [
  {
    files: styleGuide,
    description: []
  },
  {
    files: sassFiles,
    opts: {
      base: '',
      dest: 'css',
      recompileAll: true
    },
    description: [
      sass.bind(null, {
        errLogToConsole: true,
        includePaths: require('node-bourbon').includePaths
      })
    ]
  },
  {
    files: angularFiles,
    description: [
      angular.updater('main')
    ]
  },
  {
    files: htmlFiles,
    description: [
      angular.injector('main', angularFiles)
    ]
  },
  {
    files: ['src/bower_components/**/*'].concat(imgFiles),
    description: []
  }
];

var dest = 'build';
gulp.task('clean', function() {
  del.sync(dest);
});
gulp.task('build',['clean'], lg.compile(bldRules, dest, 'build', { base: 'src' }));
gulp.task('watch',['build'], lg.compile(bldRules, dest, 'watch', { base: 'src' }));
