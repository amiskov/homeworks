// Ваш код
var gulp = require('gulp'), // Сообственно Gulp JS
    less = require('gulp-less'), //плагин для Less
    eslint = require('gulp-eslint'),// проерка кода ESlint
    autoprefixer = require('gulp-autoprefixer'), // автопрефиксер
    csso = require('gulp-csso'), // Минификация CSS
    imagemin = require('gulp-imagemin'), // Минификация изображений
    uglify = require('gulp-uglify'), // Минификация JS
    concat = require('gulp-concat'), // Склейка файлов
    sourcemaps = require('gulp-sourcemaps'),
    watch = require('gulp-watch'),
    browserSync = require('browser-sync').create();

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });

});
gulp.task('lint', function () {
    return gulp.src('src/**/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});
gulp.task('styles', function () {
    return gulp.src('src/less/*.less')
        .pipe(less())
        .pipe(concat('all.css'))
        .pipe(autoprefixer({browsers: ['last 2 versions']}))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(browserSync.reload({stream: true}));
});
gulp.task('styles-prod', function () {
    return gulp.src('src/less/*.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(concat('all.css'))
        .pipe(autoprefixer({browsers: ['last 2 versions']}))
        .pipe(csso())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/css/'))
});

gulp.task('copy-images', function () {
    return gulp.src('src/img/*')
        .pipe(gulp.dest('./dist/img'));
});

gulp.task('min-images', function () {
    return gulp.src('src/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/img'));

});
gulp.task('copy-media', function () {
    return gulp.src('src/media/**/*')
        .pipe(gulp.dest('./dist/media/'));
});

gulp.task('min-media', function () {
    return gulp.src('src/media/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/media/'));

});

// Собираем JS
gulp.task('scripts', function () {
    return gulp.src(['src/js/*.js'])
        .pipe(concat('all.js')) 
        .pipe(sourcemaps.init())
        .pipe(gulp.dest('./dist/js'))
        .pipe(browserSync.reload({stream: true}));
});
gulp.task('scripts-prod', function () {
    return gulp.src(['src/js/*.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/js'))


});
gulp.task('copy-html', function () {
    return gulp.src('src/*.html')
        .pipe(gulp.dest('./dist/'))
        .pipe(browserSync.reload({stream: true}));
});
gulp.task('watch', function () {

    watch(['./src/less/*.less'], function () {
        gulp.start('styles');
    });

    watch(['./src/*.html'], function () {
        gulp.start('copy-html');
    });

    watch(['./src/js/*.js'], function () {
        gulp.start('scripts');
    });

    watch(['./src/img/*.*'], function () {
        gulp.start('copy-images');
    });
    watch(['./src/media/*.*'], function () {
        gulp.start('copy-media');
    });
});


gulp.task('default', ['copy-html', 'styles', 'scripts', 'lint', 'copy-images', 'copy-media', 'watch']);
gulp.task('prod', ['copy-html', 'styles-prod', 'lint','scripts-prod', 'min-images', 'min-media']);


