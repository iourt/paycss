var fs   = require('fs'),
    argv = require('yargs').argv,
    os   = require('os');

var reporter = require('gulp-less-reporter');

var $folder = argv.f || "",
    veros   = os.platform();

module.exports = function (gulp, $) {

    // 初始化基础资源
    gulp.task('folder', function () {
        return gulp.src([
                './mockup/package/**/*',
                '!./mockup/package/less/**/*'
            ])
            .pipe(gulp.dest('./mockup/'+ $folder +'/source'));
    });


    // less编译成CSS
    gulp.task('less', function () {
        var files = [
                './mockup/**/all.less',
                '!./mockup/package/all.less'
            ],
            dest = './mockup/';

        if ($folder) {
            files = './mockup/'+ $folder +'/source/all.less';
            dest = './mockup/'+ $folder +'/source/';
        };

        return gulp.src(files)
            .pipe($.plumber())
            .pipe($.less())
            .on('error', $.lessReporter)
            .pipe($.autoprefixer({
                browsers: ['last 2 versions']
            }))
            .pipe($.size({
                title: 'css--------------------------------'
            }))
            .pipe(gulp.dest(dest))
            .pipe($.livereload());
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
                '!./mockup/package/all.less'
            ])
            .pipe($.plumber())
            .pipe($.watch(['./mockup/**/*.less', '!./mockup/package/all.less'], function() {
                gulp.start('less');
            }));

        gulp.src('./mockup/**/*.html')
            .pipe($.plumber())
            .pipe($.watch('./mockup/**/*.html', function () {
                gulp.src('./mockup/**/*.html')
                    .pipe($.livereload());
            }));
    });


    gulp.task('move', function () {
        if ($folder) {
            gulp.src([
                    '!./mockup/**/html/',
                    '!./mockup/**/less/',
                    './mockup/'+ $folder +'/source/**/*',
                    '!./mockup/'+ $folder +'/source/**/*.less',
                    '!./mockup/'+ $folder +'/source/**/*.html'
                ])
                .pipe(gulp.dest('../'+ $folder +'/source'));
        } else {
            gulp.src([
                    '!./mockup/package/',
                    '!./mockup/**/html/',
                    '!./mockup/**/less/',
                    './mockup/**/*',
                    '!./mockup/package/**/*',
                    '!./mockup/**/*.less',
                    '!./mockup/**/*.html'
                ])
                .pipe(gulp.dest('../'));
        }
    });


    gulp.task('images:filter', function () {
        return gulp.src([
                    './mockup/'+ $folder +'/source/images/**/*',
                    './mockup/'+ $folder +'/source/all.css',
                    './mockup/'+ $folder +'/html/**/*.html'
                ])
                .pipe($.plumber())
                .pipe($.unusedImages())
                .pipe($.plumber.stop());
    });


    gulp.task('css:filter', function () {
        return gulp.src([
                    './mockup/'+ $folder +'/source/all.css',
                    './mockup/'+ $folder +'/html/**/*.html'
                ])
                .pipe($.plumber())
                .pipe($.checkUnusedCss())
                .pipe($.plumber.stop());
    });

};