/*jshint node:true*/
module.exports = function(grunt) {
	'use strict';

	grunt.initConfig({
		less: {
            dev: {
                files: {
                    'css/sandstone/sandstone-resp.css' : 'less/sandstone/sandstone-resp.less'
                }
            },
            prod: {
                options: {
                    compress: true
                },
                files: {
                    'css/sandstone/sandstone-resp.min.css' : 'less/sandstone/sandstone-resp.less'
                }
            }
        }
	});

	grunt.loadNpmTasks('grunt-contrib-less');

	grunt.registerTask('build', ['less:dev']);
};
