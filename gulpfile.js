'use strict';

let gulp = require('gulp'),
  //css
  sass = require('gulp-sass'),
  stylelint = require("stylelint"),
  autoprefixer = require("gulp-autoprefixer"),
  sourcemaps = require('gulp-sourcemaps'),
  wait = require('gulp-wait'),
  csso = require('gulp-csso'),
  //html
  pug = require('gulp-pug'),
  //js
  babel = require("gulp-babel"),
  uglify = require('gulp-uglify'),
  //svg
  cheerio = require('gulp-cheerio'),
  svgmin = require('gulp-svgmin'),
  rename = require('gulp-rename'),
  svgSprite = require('gulp-svg-sprite'),
  clean   = require('gulp-cheerio-clean-svg'),
  //images
  webp = require('gulp-webp'),
  imagemin = require('gulp-imagemin'),
  //settings
  newer = require("gulp-newer"),
  debug = require("gulp-debug"),
  notify = require("gulp-notify"),
  rigger = require("gulp-rigger"),
  plumber = require("gulp-plumber"),
  browserSync = require('browser-sync').create(),
  rimraf = require("rimraf"),
  gp = require('gulp-load-plugins')();

gulp.task('svg', function () {
  return gulp.src('src/assets/i/svg/icon-*.svg', {since: gulp.lastRun('svg')})
  .pipe(gp.newer('build/assets/i/svg/sprite/'))
    .pipe(gp.svgmin({
      js2svg: {
        pretty: true
      }
    }))
    .pipe(gp.cheerio(clean(
      {
        removeSketchType: true,
        removeEmptyGroup: true,
        removeEmptyDefs: true,
        removeEmptyLines: true,
        removeComments: true,
        tags: [
          'title',
          'desc',
        ],
        attributes: [
          'style',
          'fill*',
          'stroke*',
          "class"
        ],
      }
    )))
    .pipe(gp.replace('&gt;', '>'))
    .pipe(svgSprite({
			mode: {
				symbol: {
					sprite: "../sprite.svg",
				}
			}
    }))
    .pipe(gulp.dest("build/assets/i/svg/sprite/"));
});


gulp.task('pug', function () {
  return gulp.src('src/pug/pages/*.pug', {since: gulp.lastRun('pug')})
    .pipe(gp.newer('build/'))
    .pipe(gp.debug({title: "pug"}))
    .pipe(gp.pug({
      pretty: true
    }))
    .pipe(gulp.dest('build/'))
    .pipe(browserSync.reload({
      stream: true
    }));
    // .on('end', browserSync.reload);
  // .pipe(gp.notify("Change html"));
});

//=======================

gulp.task("css", function () {
  return gulp.src('src/assets/sass/style.scss')
    .pipe(gp.plumber())
    .pipe(gp.sourcemaps.init())
    .pipe(gp.wait(500))
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', notify.onError(function (error) {
      return 'An error occurred while compiling sass.\nLook in the console for details.\n' + error;
    })))
    .pipe(gp.autoprefixer({
      cascade: false
    }))
    .pipe(gulp.dest('build/assets/css/'))
    .pipe(gp.csso())
    .pipe(gp.rename("style.min.css"))
    .pipe(gp.sourcemaps.write('.'))
    .pipe(gulp.dest('build/assets/css/'))
    .pipe(browserSync.reload({
      stream: true
    }));
  // .pipe(gp.notify("Change css"));
});

//============================

gulp.task("libs", function () {
  return gulp.src('src/assets/libs/**/*.*', {since: gulp.lastRun('libs')})
    .pipe(gp.newer('src/assets/libs/**/*.*'))
    .pipe(gulp.dest('build/assets/libs'))
    .on('end', browserSync.reload);
});

/* favicon:build
====================================================*/
gulp.task("favicon", function () {
  return gulp.src("src/favicon.ico")
    .pipe(gulp.dest("build/"))
    .on('end', browserSync.reload);
});

/* fonts:build
====================================================*/
gulp.task("fonts", function () {
  return gulp.src('src/assets/fonts/**/*.*', {since: gulp.lastRun('fonts')})
    .pipe(gp.newer('build/assets/fonts'))
    .pipe(gulp.dest('build/assets/fonts'))
    .on('end', browserSync.reload);
});


gulp.task("webp", function () {
  return gulp.src('src/assets/i/**/*.{jpg, png}', {since: gulp.lastRun('webp')})
    .pipe(gp.newer('build/assets/i'))
    .pipe(gp.debug({title: "webp"}))
    .pipe(webp())
    .pipe(gulp.dest('build/assets/i'))
    .on('end', browserSync.reload);
});

gulp.task("js", function () {
  return gulp.src('src/assets/js/main.js')
    .pipe(gp.sourcemaps.init())
    .pipe(gp.plumber())
    .pipe(gp.rigger())
    .pipe(gp.babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest('build/assets/js'))
    .pipe(gp.uglify())
    .pipe(gp.rename("main.min.js"))
    .pipe(gp.sourcemaps.write())
    .pipe(gulp.dest('build/assets/js'))
    .pipe(browserSync.reload({
      stream: true
    }));
  // .pipe(gp.notify("Change js"));
});

/* image:dev
====================================================*/
gulp.task("image", function () {
  return gulp.src('src/assets/i/**/*.*', {since: gulp.lastRun('image')})
    .pipe(gp.newer('build/assets/i'))
    // .pipe(gp.debug({title: "image"}))
    // .pipe(gp.imagemin([
    //   imagemin.optipng({optimizationlevel: 3}),
    //   imagemin.jpegtran({progressive: true}),
    //   imagemin.svgo(),
    // ]))
    .pipe(gulp.dest('build/assets/i'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task("clean", function (cb) {
  return rimraf('build/', cb);
});

gulp.task("watch", function () {
  gulp.watch('src/assets/sass/**/*.scss', gulp.series('css'));
  gulp.watch('src/pug/**/*.pug', gulp.series('pug'));
  gulp.watch('src/assets/js/**/*.js', gulp.series('js'));
  gulp.watch(['src/assets/i/**/*.*'], gulp.series("image"));
  gulp.watch(['src/assets/i/svg/inline/*.*'], gulp.series("svg"));
  gulp.watch(['src/assets/fonts/**/*.*'], gulp.series("fonts"));
  /*watch('src/assets/audio/!**!/!*.*', function(event, cb){
      gulp.start("audio");
  });*/
});

gulp.task('browser-sync', function () {

  browserSync.init({
    server: {
      baseDir: "./build/"
    },
    notify: true
  });
});

gulp.task('default', gulp.series(
  'clean',
  gulp.parallel(
    'pug',
    'css',
    'js',
    // 'webp',
    'svg',
    'fonts',
    'image',
    'libs',
    'favicon'
  ),
  gulp.parallel('watch', 'browser-sync')
));
