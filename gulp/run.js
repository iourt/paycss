var fs = require('fs'),
    argv = require('yargs').argv,
    os = require('os'),
    inject = require('gulp-inject');

var runType = argv.run || '', // dev、build
    packageType = argv.g || 'app';

module.exports = function (gulp, $) {

    gulp.task('init', ['folder']);

};