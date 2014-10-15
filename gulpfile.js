var gulp = require('gulp');
var stylus = require('gulp-stylus');
// var tpl2mod = require('gulp-tpl2mod');
// var extReplace = require('gulp-ext-replace');
// var jade = require('gulp-jade');

var paths = {
  stylus: ['stylus/**/*.styl']
  // html: ['js/**/*.html'],
  // jade: ['jade/**/*.jade']
};

gulp.task('stylus', function() {
  return gulp.src(paths.stylus)
    .pipe(stylus())
    .pipe(gulp.dest('css'));
});

// gulp.task('tpl2mod', function() {
//   return gulp.src(paths.html)
//     .pipe(tpl2mod({
//         prefix:"module.exports=",
//         suffix:";"
//     }))
//     .pipe(extReplace('.html.js'))
//     .pipe(gulp.dest('js'));
// });

// gulp.task('jade', function() {
//   return gulp.src(paths.jade)
//     .pipe(jade())
//     .pipe(gulp.dest('html'));
// });

gulp.task('watch', function () {
  gulp.watch(paths.stylus, ['stylus']);
  // gulp.watch(paths.html, ['tpl2mod']);
  // gulp.watch(paths.jade, ['jade']);
});

gulp.task('default', ['watch']);