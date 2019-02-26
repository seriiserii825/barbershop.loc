'use strict';

let gulp = require('gulp'),
//css
sass = require('gulp-sass'),
stylelint = require("stylelint"),
autoprefixer = require("gulp-autoprefixer"),
sourcemaps = require('gulp-sourcemaps'),
wait = require('gulp-wait'),
//html
pug = require('gulp-pug'),
//js
babel = require("gulp-babel"),
//settings
notify = require("gulp-notify"),
rigger = require("gulp-rigger"),
plumber = require("gulp-plumber"),
browserSync = require('browser-sync').create(),
rimraf = require("rimraf"),
gp = require('gulp-load-plugins')();



gulp.task('pug', function(){
  return gulp.src('src/pug/pages/*.pug')
  .pipe(gp.pug({
    pretty: true
  }))
  .pipe(gulp.dest('build/'))
  .pipe(browserSync.reload({
    stream: true
  }))
  .on('end', browserSync.reload);
  // .pipe(gp.notify("Change html"));
});

//=======================

gulp.task("css", function(){
	return gulp.src('src/assets/sass/style.scss')
  .pipe(gp.sourcemaps.init())
  .pipe(gp.wait(500))
	.pipe(sass({outputStyle: 'expanded'}).on('error', notify.onError(function (error) {
		return 'An error occurred while compiling sass.\nLook in the console for details.\n' + error;
	})))
	.pipe(gp.sourcemaps.write())
	.pipe(gp.plumber())
	.pipe(gp.autoprefixer({
		cascade: false
	}))
	.pipe(gulp.dest('build/assets/css/'))
	.pipe(browserSync.reload({stream: true}));
	// .pipe(gp.notify("Change css"));
});

//============================

gulp.task("libs", function(){
  return gulp.src('src/assets/libs/**/*.*')
  .pipe(gulp.dest('build/assets/libs'))
  .on('end', browserSync.reload);
});

/* favicon:build
====================================================*/
gulp.task("favicon", function(){
  return gulp.src("src/favicon.ico")
  .pipe(gulp.dest("build/"))
  .on('end', browserSync.reload);
});

/* fonts:build
====================================================*/
gulp.task("fonts", function(){
  return gulp.src('src/assets/fonts/**/*.*')
      .pipe(gulp.dest('build/assets/fonts'))
  .on('end', browserSync.reload);
});

gulp.task("js", function(){
  return gulp.src('src/assets/js/main.js')
  .pipe(gp.sourcemaps.init())
  .pipe(gp.plumber())
  .pipe(gp.rigger())
  .pipe(gp.babel({
    presets: ['@babel/env']
  }))
  .pipe(gp.sourcemaps.write())
  .pipe(gulp.dest('build/assets/js'))
  .pipe(browserSync.reload({stream: true}));
  // .pipe(gp.notify("Change js"));
});

/* image:dev
====================================================*/
gulp.task("image", function(){
  return gulp.src('src/assets/i/**/*.*')
      .pipe(gp.plumber())
      .pipe(gulp.dest('build/assets/i'))
  .pipe(browserSync.reload({stream: true}))
});

gulp.task("clean", function(cb){
  return rimraf('build/', cb);
});

gulp.task("watch", function(){
  gulp.watch('src/assets/sass/**/*.scss', gulp.series('css'));
  gulp.watch('src/pug/**/*.pug', gulp.series('pug'));
  gulp.watch('src/assets/js/**/*.js', gulp.series('js'));
  gulp.watch(['src/assets/i/**/*.*'], gulp.series("image"));
  gulp.watch(['src/assets/fonts/**/*.*'], gulp.series("fonts"));
  /*watch('src/assets/audio/!**!/!*.*', function(event, cb){
      gulp.start("audio");
  });*/
});

gulp.task('browser-sync', function(){

  browserSync.init({
    server: {
      baseDir: "./build/"
    },
    notify: true
  });
});

gulp.task('default', gulp.series(
    'clean',
	gulp.parallel('pug', 'css', 'js', 'fonts', 'image', 'libs', 'favicon'),
	gulp.parallel('watch', 'browser-sync')
));

