/**
 *
 *  Web Starter Kit
 *  Copyright 2014 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// Optimize Images
gulp.task('images', function () {
    return gulp.src('app/images/**/*')
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe(reload({stream: true, once: true}))
        .pipe($.size({title: 'images'}));
});


// Compile Less Files You Added (app/styles)
gulp.task('styles', function () {
    return gulp.src(['app/styles/**/*.less'])
        .pipe($.less())
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('dist/styles'))
        .pipe(reload({stream: true, once: true}))
        .pipe($.size({title: 'styles'}));
});


gulp.task('copy:html', function () {
    return gulp.src('app/**/*.html')
        .pipe(gulp.dest('dist'))
        .pipe(reload({stream: true, once: true}))
        .pipe($.size({title: 'html'}));
});

gulp.task('typescript', function () {
    return gulp.src('app/scripts/**/*.ts')
        .pipe($.tsc({module: 'amd'}))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(reload({stream: true, once: true}))
        .pipe($.size({title: 'typescript'}));
});

gulp.task('copy:js', function () {
    return gulp.src('app/scripts/**/*.js')
        .pipe(gulp.dest('dist/scripts'))
        .pipe(reload({stream: true, once: true}))
        .pipe($.size({title: 'copy:js'}));
});

gulp.task('copy', ['copy:js', 'copy:html']);

// Clean Output Directory
gulp.task('clean', del.bind(null, ['dist']));

// Watch Files For Changes & Reload
gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: ['dist']
        },
        notify: false
    });

    gulp.watch(['app/**/*.html'], ['copy:html']);
    gulp.watch(['app/styles/**/*.{css,less}'], ['styles']);
    gulp.watch(['app/scripts/**/*.ts'], ['typescript']);
    gulp.watch(['app/scripts/**/*.js'], ['copy:js']);
    gulp.watch(['app/images/**/*'], ['images']);
});

// Build Production Files, the Default Task
gulp.task('default', ['clean'], function (cb) {
    runSequence(['styles', 'typescript', 'copy', 'images'], cb);
});
