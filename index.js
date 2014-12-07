define(function (require) {
    require('./app/theme');
    require('jquery.file.upload');
    require('chart');
    var remote = require('app/remote');
    var notification = require('crystal-extra/notification');

    var ko = require('knockout');
    var _ = require('lodash');
    var slice = [].slice;
    var moment = require('moment');

    var queryParser = require('crystal/lib/util/query-parser');
    var queryData = queryParser.parse(location.search.substring(1));

    remote.enums({}, function(err, data) {
        if (err) {
            alert(err);
        } else {
            ENV.enums = data;
            require('app/enums')(data);
            ENV.enums = _.extend(ENV.enums.mapping, ENV.enums.notMapping);

            var state = require('./app/state');
            var loader = require('./app/loader');

            require('crystal/lib/model-visible-by-state')(loader, state);

            require('./app/binding-handlers');
            loader.render(require('./app/components'), document.body)

            _.extend(window, {
                _: _,
                ko: ko,
                DataGroup: require('crystal-extra/data-group'),
                notification: notification,

                loader: loader,
                state: state,
                remote: require('app/remote'),

                notifyOnErrorContinue: function (optCallback) {
                    return function (err) {
                        notification.clear();

                        if (arguments.length === 1) {
                            if (err && !/abort$/.test(err)) {
                                notification.error(err);
                            }
                        }

                        if (optCallback) {
                            optCallback.apply(this, arguments)
                        }
                    }
                },

                notifyOnError: function (optCallback) {
                    return function (err) {
                        notification.clear();

                        if (arguments.length === 1) {
                            if (err && !/abort$/.test(err)) {
                                notification.error(err);
                            }
                        } else {
                            if (optCallback) {
                                optCallback.apply(this, slice.call(arguments, 1))
                            }
                        }
                    }
                },

                createPreviewUrl: function(picUrl) {
                    return ko.computed(function() {
                        return picUrl() ? ENV.picPrefix + picUrl() + ENV.picSuffix : '';
                    })
                },             

                // Class
                // Validator: require('crystal-extra/validator'),
             
                dialog: require('app/dialog'),
                // defined: {
                //     validator: require('crystal-extra/defined/validator'),
                //     property: require('crystal-extra/defined/property')
                // },

                dataUtil: require('crystal/lib/util/data')
                
            })
        }
    });
    

});