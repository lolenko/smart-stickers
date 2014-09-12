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
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var AUTOPREFIXER_BROWSERS = [
    'ie >= 8',
    'ie_mob >= 10',
    'ff >= 25',
    'chrome >= 30',
    'safari >= 6',
    'opera >= 12',
    'ios >= 6',
    'android >= 2.3',
    'bb >= 10'
];

// Lint JavaScript
gulp.task('jshint', function () {
    return gulp.src('scripts/*.js')
        .pipe(reload({stream: true, once: true}))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

// Compile and Automatically Prefix Stylesheets
gulp.task('styles', function () {
    // For best performance, don't add Sass partials to `gulp.src`
    return gulp.src([
        'styles/*.less',
        'styles/*.css'
    ])
        .pipe($.changed('styles/dest', {extension: '.css'}))
        .pipe($.if('*.less', $.less()
                .on('error', console.error.bind(console))
        ))
        .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe(gulp.dest('styles/dest'))
        .pipe($.size({title: 'styles'}));
});



// Watch Files For Changes & Reload
gulp.task('default', ['styles'], function () {
    browserSync({
        notify: false,
        // Run as an https by uncommenting 'https: true'
        // Note: this uses an unsigned certificate which on first access
        //       will present a certificate warning in the browser.
        // https: true,
        server: {
            baseDir: ['.']
        }
    });

    gulp.watch(['**/*.html'], reload);
    gulp.watch(['styles/**/*.{less,css}'], ['styles', reload]);
    gulp.watch(['scripts/**/*.js'], ['jshint']);
});


// Load custom tasks from the `tasks` directory
try { require('require-dir')('tasks'); } catch (err) {}
