module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        'clean': {
            component: {
                src: ['component/**/*.js']
            },

            dist: {
                src: ['dist']
            }

            // 'include-all': {
            //     src: ['component/include-all.js']
            // }
        },

        'dpm-convert': {      
            component: {
                src: ['component/**/*.html']
            }
        },

        'dpm-create-include-all': {
            component: {
                src: 'component/**/*.js',
                dest: 'component/include-all.js'
            }
        },

        'dpm-compress': {      
            all: {
                seaConfigFile: 'seajs-config.js',
                baseUrl: 'index.js',
                src: 'index.js'
            }
        },

        'dpm-convert': {
            component: {
                src: 'component/**/*.html'
            }
        },

        'copy': {
            deploy: {
                files: [
                    {
                        src: [
                            '*.{js,css,map}',
                            'component/**/*.js',
                            'asset/**/*.{png,jpg,gif}',
                            'vendor-wrap-with-define/asset/bootstrap3/**/*.*'
                        ],
                        dest: 'dist/'
                    }
                ]
            }
        },

        'ftp-deploy': {
            e2f: {
                auth: {
                    host: '192.168.8.174',
                    port: 21,
                    authKey: 'e2f'
                },
                src: ['dist'],
                dest: '<%= "biz-static/" + pkg.name %>',
                exclusions: []
            },

            sys: {
                auth: {
                    host: '10.1.4.124',
                    port: 21,
                    authKey: 'sys'
                },
                src: ['dist'],
                dest: '<%= pkg.name + "/" + pkg.version %>',
                exclusions: []
            },

            dpfile: {
                auth: {
                    host: '10.1.2.121',
                    port: 21,
                    authKey: 'dpfile'
                },
                src: ['dist'],
                dest: '<%= pkg.name + "/" + pkg.version %>',
                exclusions: []
            }
        }

    });

    
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-ftp-deploy');
    grunt.loadNpmTasks('grunt-dpm');

    grunt.registerTask('dist', ['clean:dist', 'dpm-convert', 'dpm-create-include-all', 'dpm-compress', 'copy:deploy', 'clean:component']);

    grunt.registerTask('alpha', ['dist', 'ftp-deploy:e2f']);
    grunt.registerTask('beta', ['dist', 'dpm-auto-increase-version', 'ftp-deploy:dpfile']);


};