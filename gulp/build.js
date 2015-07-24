var fs   = require('fs'),
    argv = require('yargs').argv,
    os   = require('os');

var getProject = require('./tools/folder.js'),
    buildFolder = require('./tools/build.folder.js')();


var $folder = argv.f, // 默认打APP的包，如果要打H5的包就 --g web
    d           = new Date(),
    version     = d.getTime(),
    veros       = os.platform();

module.exports = function (gulp, $) {

    // 初始化基础资源
    gulp.task('folder', function () {
        return gulp.src([
                './mockup/common/**/*',
                '!./mockup/common/less/**/*'
            ])
            .pipe(gulp.dest('./mockup/'+ $folder +'/source'));
    });


    // less编译成CSS
    gulp.task('less', function () {
        return gulp.src([
                './mockup/**/all.less',
                '!./mockup/common/all.less'
            ])
            .pipe($.less())
            .pipe(gulp.dest('./mockup/'));
    });

};