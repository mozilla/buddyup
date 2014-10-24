/*jshint node:true*/
module.exports = function(grunt) {

    grunt.initConfig({
        jshint: {
            files: ['grunt.js'],
            options: {
                bitwise: true,
                camelcase: true,
                curly: true,
                eqeqeq: true,
                forin: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                quotmark: "single",
                regexp: true,
                undef: true,
                unused: true,
                trailing: true,
                browser: true,
                jquery: true
            }
        },
        csslint: {
            base_theme: {
                src: "css/*.css",
                rules: {
                    "empty-rules": 2,
                    "fallback-colors": 2,
                    "font-sizes": 2,
                    "important": 2,
                    "outline-none": 2,
                    "vendor-prefix": 2,
                    "zero-units": 2
                }
            }
        },
        nunjucks: {
            precompile: {
                baseDir: 'app/views/',
                src: 'app/views/*',
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
        }
    });

    grunt.loadNpmTasks('grunt-nunjucks');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('grunt-contrib-jshint')
    grunt.loadNpmTasks('grunt-css');

    grunt.registerTask('default', ['nunjucks', 'connect', 'watch']);
    grunt.registerTask('lintify', ['jshint', 'csslint']);
    grunt.registerTask('precompile', ['nunjucks:precompile']);
};
