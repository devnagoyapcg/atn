const gulp   = require('gulp'),
    terser   = require('gulp-terser'),
    concat   = require('gulp-concat'),
    cssmin   = require('gulp-cssmin'),
    sassGlob = require('gulp-sass-glob'),
    rename   = require('gulp-rename'),
    sass     = require('gulp-sass')(require('sass'));
    merge    = require('merge-stream');

const pathsLogin = {
    prefix: 'index',
    js: ['resources/private/login/jsrc/login.js'],
    js_out: 'resources/public/js/',
    scss: 'resources/private/login/scss/*.scss',
    css: 'resources/public/css/',
}

const pathsAdmin = {
    prefix: 'admin',
    js: ['resources/private/admin/jsrc/admin.js',
         'resources/private/admin/jsrc/header.js',
         'resources/private/admin/jsrc/article.js',
         'resources/private/admin/jsrc/footer.js'],
    js_out: 'resources/public/js/',
    scss: 'resources/private/admin/scss/*.scss',
    css: 'resources/public/css/',
}

const pathsSuper = {
    prefix: 'super',
    js: ['resources/private/super/jsrc/super.js',
         'resources/private/super/jsrc/header.js',
         'resources/private/super/jsrc/article.js',
         'resources/private/super/jsrc/footer.js'],
    js_out: 'resources/public/js/',
    scss: 'resources/private/super/scss/*.scss',
    css: 'resources/public/css/',
}

gulp.task('js', gulp.series([], function() {
    var login = gulp.src(pathsLogin.js, {allowEmpty: true})
        /*.pipe(builder({
            platforms: ['win64','osx64','linux64']
        }))*/
        .pipe(concat(pathsLogin.prefix + ".min.js"))
        //.pipe(terser())
        .pipe(gulp.dest(pathsLogin.js_out));
    var admin = gulp.src(pathsAdmin.js, {allowEmpty: true})
        /*.pipe(builder({
            platforms: ['win64','osx64','linux64']
        }))*/
        .pipe(concat(pathsAdmin.prefix + ".min.js"))
        //.pipe(terser())
        .pipe(gulp.dest(pathsAdmin.js_out));
    var superadmin = gulp.src(pathsSuper.js, {allowEmpty: true})
        /*.pipe(builder({
            platforms: ['win64','osx64','linux64']
        }))*/
        .pipe(concat(pathsSuper.prefix + ".min.js"))
        //.pipe(terser())
        .pipe(gulp.dest(pathsSuper.js_out));
    return merge([login, admin, superadmin]);
}));

sass.compiler = require('node-sass');
gulp.task('css', gulp.series([], function() {
    var login = gulp.src(pathsLogin.scss)
        .pipe(sassGlob())
        .pipe(sass().on('error', sass.logError))
        .pipe(cssmin())
        .pipe(gulp.dest(pathsLogin.css))
    var admin = gulp.src(pathsAdmin.scss)
        .pipe(sassGlob())
        .pipe(sass().on('error', sass.logError))
        .pipe(cssmin())
        .pipe(gulp.dest(pathsAdmin.css))
    var superadmin = gulp.src(pathsSuper.scss)
        .pipe(sassGlob())
        .pipe(sass().on('error', sass.logError))
        .pipe(cssmin())
        .pipe(gulp.dest(pathsSuper.css))
    return merge([login, admin, superadmin]);
}));

// Build
gulp.task('default', gulp.series(['js','css']));
