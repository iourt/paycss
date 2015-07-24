var fs   = require('fs'),
    argv = require('yargs').argv,
    os   = require('os');

var $folder = argv.f,
    veros   = os.platform();

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
            .pipe($.plumber())
            .pipe($.less())
            .pipe($.autoprefixer({
                browsers: ['last 2 versions']
            }))
            .pipe($.size({
                title: 'css--------------------------------'
            }))
            .pipe(gulp.dest('./mockup/'));
    });


    gulp.task('connect', function () {
        var url = '',
            port = 9999;

        $.connect.server({
            root: "./mockup/",
            port: port,
            livereload: true
        });

        switch (veros) {
            case 'win32':
                url = 'start http://localhost:' + port;
            break;

            case 'darwin':
                url = 'open http://localhost:' + port;
            break;
        }

        gulp.src('')
            .pipe($.shell(url));
    });


    gulp.task('watch', function() {
        $.livereload.listen();

        gulp.src([
                './mockup/**/*.less',
                '!./mockup/common/all.less'
            ])
            .pipe($.plumber())
            .pipe($.watch([
                    './mockup/**/*.less',
                    '!./mockup/common/all.less'
                ], function() {
                    gulp.start('less');
                })
            )
            .pipe($.livereload());

    });

};