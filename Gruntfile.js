/*jshint node:true*/
module.exports = function(grunt) {
	'use strict';

	grunt.initConfig({
		less: {
            dev: {
                files: {
                    'css/sandstone.css' : 'less/sandstone/sandstone-resp.less',
					'css/buddyup.css' : 'less/buddyup.less'
                }
            },
            prod: {
                options: {
                    cleancss: true,
					report: 'min'
                },
                files: {
                    'css/sandstone.css' : 'less/sandstone/sandstone-resp.less',
					'css/buddyup.css' : 'less/buddyup.less'
                }
            }
        }
	});

	grunt.loadNpmTasks('grunt-contrib-less');

	grunt.registerTask('default', ['less:dev']);
	grunt.registerTask('dist', ['less:prod']);
};
