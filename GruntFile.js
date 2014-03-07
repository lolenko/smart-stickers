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
                    concat: true
                },
                files: {
                    expand: true,
                    cwd:    "src/less",
                    dest:    "styles",
                    src:    ["*.less", '*.css'],
                    ext:    ".css"
                }
            }
        },
        typescript: {
            base: {
                src: ['src/ts/**/*.ts'],
                dest: 'js/stickers.js',
                options: {
                    module: 'amd',
                    target: 'es5'
                }
            }
        },
        watch: {
            files: '**/*.ts',
            tasks: ['typescript', 'less']
        },
        open: {
            dev: {
                path: 'http://localhost:8080/index.html'
            }
        }
    });

    grunt.registerTask('default', ['less']);

}