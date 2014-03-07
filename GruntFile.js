module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
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
                    // target.css file: source.less file
                    "styles/reset.css": "./src/less/reset.less",
                    "styles/main.css": "./src/less/main.less"
                }
            }
        },
        typescript: {
            base: {
                src: ['src/ts/**/*.ts'],
                dest: 'js',
                options: {
                    module: 'amd',
                    target: 'es5',
                    base_path: 'src/ts'
                }
            }
        },
        watch: {
            typescript: {
                files: 'src/ts/*.ts',
                tasks: ['typescript']
            },
            less: {
                files: 'src/less/*.less',
                tasks: ['less']
            }
        },
        open: {
            dev: {
                path: 'http://localhost:8080/index.html'
            }
        }
    });

    grunt.registerTask('default', ['typescript', 'less', 'connect', 'open', 'watch']);

}