/*jshint node:true*/
module.exports = function(grunt) {

    grunt.initConfig({
        nunjucks: {
            precompile: {
                baseDir: 'app/views/',
                src: 'app/views/**',
                dest: 'app/js/templates.js',
                options: {
                    name: function(filename) {
                        return filename;
                    }
                }
            }
        },
        connect: {
            server: {
                default_options: {}
            }
        },
        watch: {
            scripts: {
                files: ['js/app.js', 'app/views/*'],
                tasks: ['nunjucks']
            }
        },
        extract: {
            buddyup: {
                src: ['app/views/**/*.html', 'app/js/**/*.js'],
                dest: 'locale/templates/LC_MESSAGES/buddyup.pot',
            }
        },
    });

    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-nunjucks');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['nunjucks']);
    grunt.registerTask('dev', ['nunjucks', 'connect', 'watch']);
};
