"use strict";

let gulp = require("gulp"),
    autoprefixer = require("gulp-autoprefixer"),
    rename = require("gulp-rename"),
    sass = require("gulp-sass"),
    cssnano = require("gulp-cssnano"),
    htmlmin = require('gulp-htmlmin'),
    rigger = require("gulp-rigger"),
    jsmin = require('gulp-jsmin'),
    babel = require("gulp-babel"),
    map = require("gulp-map"),
    watch = require("gulp-watch"),
    sourcemaps = require('gulp-sourcemaps'),
    plumber = require("gulp-plumber"),
    run = require("run-sequence"),
    newer = require('gulp-newer'),
    notify = require("gulp-notify"),
    rimraf = require("rimraf"),
    tinypng = require('gulp-tinypng-compress'),
    browserSync = require('browser-sync').create();

    //filter    = require('gulp-filter'),//(spriteSvgImg)
    // svgSprite = require('gulp-svg-sprite'),
    // svgSprites = require("gulp-svg-sprites"),
    // svgmin = require('gulp-svgmin'),
    //svg2png   = require('gulp-svg2png'),//spriteSvgImg
    //cheerio = require('gulp-cheerio'),//(sprite:svg)
    //replace = require('gulp-replace'),//(sprite:svg)
    //spritesmith = require('gulp.spritesmith'),//(sprite)



/* Paths to source/build/watch files
=========================*/
let path = {
  build: {
    html: "build/",
    js: "build/assets/js/",
    css: "build/assets/css/",
    img: "build/assets/i/",
    fonts: "build/assets/fonts/",
    libs: "build/assets/libs/"
    //header: "build/assets/header/"
  },
  src: {
    html: "src/*.{htm,html}",
    js: "src/assets/js/main.js",
    css: "src/assets/sass/style.scss",
    img: "src/assets/i/**/*.*",
    fonts: "src/assets/fonts/**/*.*",
    //header: "src/assets/header/header.less",
    libs: "src/assets/libs/**/*.*",
  },
  watch: {
    html: "src/**/*.{htm,html}",
    js: "src/assets/js/**/*.js",
    css: "src/assets/sass/**/*.scss",
    img: "src/assets/i/**/*.*",
    fonts: "src/assets/fonts/**/*.*",
    //header: "src/assets/header/**/*.less",
    libs: "src/assets/libs/**/*.*"
  },
  clean: "./build"
};

/* browser-sync
=========================*/
gulp.task('browser-sync', function(){

  browserSync.init({
    server: {
      baseDir: "./build/"
    },
    notify: true
  });
});

/* html:build
====================================================*/
gulp.task("html", function(){
  return gulp.src(path.src.html)
      .pipe(sourcemaps.init())
      .pipe(plumber())
      .pipe(rigger())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(path.build.html))
      .pipe(browserSync.reload({
        stream: true
      }))
      .pipe(notify("Change html"));
});

gulp.task("html:build", function(){
  return gulp.src(path.src.html)
      .pipe(sourcemaps.init())
      .pipe(plumber())
      .pipe(rigger())
      .pipe(sourcemaps.write())
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest(path.build.html));
});

/* libs:build
====================================================*/
gulp.task("libs", function(){
  return gulp.src(path.src.libs)
      .pipe(gulp.dest(path.build.libs))
      .pipe(browserSync.stream());
});


/* favicon:build
====================================================*/
gulp.task("favicon", function(){
  return gulp.src("src/favicon.ico")
      .pipe(gulp.dest("build/"))
      .pipe(browserSync.stream());
});

/* css:build
====================================================*/
gulp.task("css:build", function(){
  gulp.src(path.src.css)
      .pipe(plumber())
      .pipe(sass())
      .pipe(autoprefixer())
      .pipe(cssnano({
        zindex: false,
        discardComments: {
          removeAll: true
        }
      }))
      .pipe(rename("style.min.css"))
      .pipe(gulp.dest(path.build.css));
});

/* css:dev
====================================================*/
gulp.task("css", function(){
  gulp.src(path.src.css)
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', notify.onError(function (error) {
        return 'An error occurred while compiling sass.\nLook in the console for details.\n' + error;
      })))
       .pipe(plumber())
      .pipe(sass())
       .pipe(autoprefixer())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(path.build.css))
      .pipe(browserSync.reload({
        stream: true
      }))
      .pipe(notify("Change css"));
});

/* js:dev
====================================================*/
gulp.task("js", function(){
  gulp.src(path.src.js)
      .pipe(sourcemaps.init())
      .pipe(plumber())
      .pipe(rigger())
      .pipe(babel({
        presets: ['env']
      }))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(path.build.js))
      .pipe(browserSync.reload({
        stream: true
      }))
      .pipe(notify("Change js"));
});


/* js:build
====================================================*/
gulp.task("js:build", function(){
  gulp.src(path.src.js)
      .pipe(plumber())
      .pipe(rigger())
      .pipe(babel({
        presets: ['env']
      }))
      .pipe(jsmin())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest(path.build.js));
});

/* fonts:build
====================================================*/
gulp.task("fonts", function(){
  gulp.src(path.src.fonts)
      .pipe(gulp.dest(path.build.fonts));
});

/* image:dev
====================================================*/
gulp.task("image", function(){
  gulp.src(path.src.img)
      .pipe(plumber())
      .pipe(gulp.dest(path.build.img));
});

/* image:build
====================================================*/
gulp.task("tinypng", function(){
  gulp.src(path.src.img)
      .pipe(plumber())
      .pipe(tinypng({
          key: 'n3bfGZY6wU3OWNZZAIigLe444WovtR9_',
          log: true
      }))
      .pipe(gulp.dest(path.build.img));
});

/* sprite
====================================================*/
// gulp.task('sprite', function(){
//     let spriteData = gulp.src('src/assets/i/icons/*.*')
//         .pipe(plumber())
//         .pipe(spritesmith({
//             imgName: '../i/sprite.png',
//             cssName: '_sprite.scss',
//             cssFormat: 'scss',
//             algorithm: 'binary-tree',
//             padding: 20
//         }));
//     spriteData.img.pipe(gulp.dest('src/assets/i'));
//     spriteData.css.pipe(gulp.dest('src/assets/sass/partials/'));
// });

gulp.task("clean", function(cb){
  rimraf(path.clean, cb);
});

/* spriteSvg
====================================================*/
/*gulp.task('svg', function () {
    return gulp.src('src/assets/i/icons/svg/*.svg')
    // minify svg
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        // remove all fill, style and stroke declarations in out shapes
        .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parserOptions: {xmlMode: true}
        }))
        // cheerio plugin create unnecessary string '&gt;', so replace it.
        .pipe(replace('&gt;', '>'))
        // build svg sprite
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: "sprite.svg",
                    render: {
                        scss: {
                            dest:'_sprite.scss',
                            template: "src/assets/sass/partials/_sprite_template.scss"
                        }
                    }
                }
            }
        }))
        .pipe(gulp.dest('src/assets/i/'));
});*/

/*spritesSvgImg
 ===============================*/
/*gulp.task('sprites', function () {
    return gulp.src('src/assets/i/icons/svg/*.svg')
        .pipe(svgSprites())
        .pipe(gulp.dest("src/assets/i/sprite-svg-img/")) // Write the sprite-sheet + CSS + Preview
        .pipe(filter("***.svg"))  // Filter out everything except the SVG file
        .pipe(svg2png())           // Create a PNG
        .pipe(gulp.dest("src/assets/i/sprite-svg-img/"));
});*/

/*audio
 ===============================*/
/*gulp.task('audio', function () {
    return gulp.src('src/assets/audio/**//**.*//*')
        .pipe(gulp.dest("build/assets/audio/"))
});*/

/* watch
====================================================*/
gulp.task("watch", function(){
  watch([path.watch.html], function(event, cb){
    gulp.start("html");
  });
  watch([path.watch.css], function(event, cb){
    gulp.start("css");
  });
  watch([path.watch.libs], function(event, cb){
    gulp.start("libs");
  });
  watch([path.watch.js], function(event, cb){
    gulp.start("js");
  });
  watch([path.watch.img], function(event, cb){
    gulp.start("image");
  });
  watch([path.watch.fonts], function(event, cb){
    gulp.start("fonts");
  });
  /*watch('src/assets/audio/!**!/!*.*', function(event, cb){
      gulp.start("audio");
  });*/
});

/* default
====================================================*/
gulp.task("default", function(cb){
  run(
      "clean",
      "html",
      "css",
      "libs",
      "favicon",
      "js",
      "fonts",
      "image",
      "browser-sync",
      "watch"
      , cb);
});

/* build
====================================================*/
gulp.task('build', function(cb){
  run(
      "clean",
      "html:build",
      "css:build",
      "libs",
      "favicon",
      "js:build",
      "fonts",
      "image",
      "browser-sync"
      //"audio"
      , cb);
});

