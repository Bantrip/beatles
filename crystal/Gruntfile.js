module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        'watch': {
            options: {
                livereload: 35728
            },

            all: {
                files: ['**/*.js'],
                tasks: [],
            }
        }
    });

    // watch
    var changedFiles = Object.create(null);
    var onChange = grunt.util._.debounce(function() {
        grunt.config(['dpm-convert', 'all'], Object.keys(changedFiles));
        changedFiles = Object.create(null);
    }, 200);
    grunt.event.on('watch', function(action, filepath) {
        changedFiles[filepath] = action;
        onChange();
    });
    // end watch
    
    grunt.loadNpmTasks('grunt-dpm');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['watch']);


};