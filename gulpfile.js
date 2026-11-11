const gulp = require('gulp');
const concat = require('gulp-concat');
const cssnano = require('gulp-cssnano');
const sass = require('gulp-sass')(require('sass'));
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const del = require('del');

const paths = {
  html: 'src/*.html',
  scss: 'src/scss/**/*.scss',
  js: 'src/js/**/*.js',
  images: 'src/images/**/*'
};

function clean() {
  return del(['dist/**/*']);
}

function styles() {
  return gulp.src(paths.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/css'));
}

function scripts() {
  return gulp.src(paths.js)
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/js'));
}

function optimizeImages() {
  return gulp.src(paths.images)
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'));
}

function copyHtml() {
  return gulp.src(paths.html).pipe(gulp.dest('dist'));
}

const build = gulp.series(clean, gulp.parallel(styles, scripts, optimizeImages, copyHtml));
function watchFiles() {
  gulp.watch(paths.scss, styles);
  gulp.watch(paths.js, scripts);
  gulp.watch(paths.images, optimizeImages);
  gulp.watch(paths.html, copyHtml);
}

exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.optimizeImages = optimizeImages;
exports.watch = gulp.series(build, watchFiles);
exports.build = build;
exports.default = build;
