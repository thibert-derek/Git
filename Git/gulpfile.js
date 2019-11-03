const { src, dest, watch, parallel, series } = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const del = require('delete');
const terser = require('gulp-terser');
const concat = require('gulp-concat');
const typescript = require('gulp-typescript');
const sourcemaps = require ('gulp-sourcemaps');

function css() {
  return src('app/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' })) // nested, compact, expanded, compressed
    .pipe(sourcemaps.write('.'))
    .pipe(dest('prod/css/'));
}

function html() {
  return src('app/**/*.html').pipe(dest('prod/'));
}

function js() {
  return src(['app/**/*.js', 'app/**/*.ts'])
    .pipe(sourcemaps.init())
    .pipe(typescript({ target: 'ES5', allowJs: true }))
    .pipe(terser())
    .pipe(concat('main.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('prod/js'));
}

function clean(cb) {
  del(['prod/**/*'], cb);
}

function watch_task() {
  watch('app/**/*.scss', series(css, reload));
  watch('app/**/*.html', series(html, reload));
  watch('app/**/*.js', series(js, reload));
}

function sync(cb) {
  browserSync.init({
    server: { baseDir: 'prod/' }
  });
  cb();
}

function reload(cb) {
  browserSync.reload();
  cb();
}

exports.clean = clean;
exports.build = series(clean, parallel(css, html, js));
exports.default = series(exports.build, sync, watch_task);
