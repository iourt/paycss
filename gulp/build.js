var fs      = require('fs'),
    argv    = require('yargs').argv,
    os      = require('os'),
    $folder = argv.f || "",
    veros   = os.platform();

var cssFiles = [
        './mockup/**/all.less',
        '!./mockup/package/all.less'
    ],
    cssDest = './mockup/';

if ($folder) {
    cssFiles = [
        './mockup/'+ $folder +'/source/all.less'
    ];
    cssDest = './mockup/'+ $folder +'/source/';
};

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

        return gulp.src(cssFiles)
            .pipe($.plumber())
            .pipe($.less())
            .on('error', $.lessReporter)
            .pipe($.autoprefixer({
                browsers: ['last 2 versions']
            }))
            .pipe($.size())
            .pipe(gulp.dest(cssDest));
            // .pipe($.livereload());
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
                gulp.src(cssFiles)
                    .pipe($.plumber())
                    .pipe($.less())
                    .on('error', $.lessReporter)
                    .pipe($.autoprefixer({
                        browsers: ['last 2 versions']
                    }))
                    .pipe($.size())
                    .pipe(gulp.dest(cssDest))
                    .pipe($.livereload());
            }));

        gulp.src('./mockup/**/*.html')
            .pipe($.watch('./mockup/**/*.html'))
            .pipe($.livereload());
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