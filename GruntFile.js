module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-open');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    port: 8080,
                    base: './'
                }
            }
        },
        less: {
            development: {
                options: {
                    concat: false
                },
                files: {
                    "styles/reset.css": "./src/styles/reset.less",
                    "styles/main.css": "./src/styles/main.less"
                }
            }
        },
        typescript: {
            base: {
                src: ['src/scripts/**/*.ts'],
                dest: 'js',
                options: {
                    module: 'amd',
                    target: 'es5',
                    base_path: 'src/scripts'
                }
            }
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        src: '**/*.js',
                        cwd: 'src/scripts',
                        dest: 'js/'
                    }
                ]
            }
        },
        watch: {
            scripts: {
                files: 'src/scripts/*.ts',
                tasks: ['typescript']
            },
            styles: {
                files: 'src/styles/*.less',
                tasks: ['less']
            }
        },
        open: {
            dev: {
                path: 'http://localhost:8080/index.html'
            }
        }
    });

    grunt.registerTask('default', ['copy', 'typescript', 'less', 'connect', 'open', 'watch']);

}