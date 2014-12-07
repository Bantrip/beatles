module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        'wrap-with-define': {
            vendor: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: '**/*.js',
                    dest: 'dist'
                }]
            }
        },

        'clean': {
            dist: {
                src: 'dist/*'
            }
        },

        'concat': {
            noty: {
                src: ['noty/jquery.noty.js', 'noty/layouts/*.js', 'noty/themes/*.js'],
                dest: 'src/noty.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerMultiTask('wrap-with-define', 'wrap code with "define"', function() {
        this.files.forEach(function(fileObj) {
            grunt.file.write(fileObj.dest, 'define(function(require, exports, module) {\n' + grunt.file.read(fileObj.src[0]) + '\n});')
        });
    })

    grunt.registerTask('default', ['clean', 'concat', 'wrap-with-define']);

};