var fs = require('fs'),
    argv = require('yargs').argv,
    os = require('os'),
    inject = require('gulp-inject');

var runType = argv.run || '', // dev、build
    packageType = argv.g || 'app';

module.exports = function (gulp, $) {

    gulp.task('init', ['folder']);

    gulp.task('check:images', ['less'], function () {
        gulp.start('images:filter');
    });

    gulp.task('check:css', ['less'], function () {
        gulp.start('css:filter');
    });

    gulp.task('run', ['less', 'connect', 'watch']);

    gulp.task('build', ['less'], function () {
        gulp.start('move');
    });

};