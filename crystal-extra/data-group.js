define(function(require) {
    var _ = require('lodash');
    var capitalize = function(str) {
        return str.charAt(0).toUpperCase() + str.substring(1);
    };

    return require('crystal/lib/mixin').extend(
        function(model, defaultData) {
            this.model = model;
            this.defaultData = defaultData;

            var g = this._g = {};
            var s = this._s = {};

            var self = this;
            _.each(defaultData, function(defaultValue, key) {
                var methodName = capitalize(key);

                g[key] = self['get' + methodName] || function() {
                    return model[key]();
                };

                s[key] = self['set' + methodName] || function(v) {
                    model[key](v);
                    return model;
                };
            });
        },
        {
            getData: function() {
                var model = this.model;
                var self = this;
                var g = this._g;
                return _.reduce(this.defaultData, function(all, defaultValue, key) {
                    all[key] = g[key].call(self);
                    return all;
                }, {});
            },

            setData: function(data) {
                var model = this.model;
                var self = this;
                var s = this._s;
                _.each(this.defaultData, function(defaultValue, key) {
                    s[key].call(self, (key in data) ? data[key] : _.isArray(defaultValue) ? defaultValue.slice() : defaultValue);            
                });
            },

            getDefaultData: function() {
                return _.extend({}, this.defaultData);
            },

            reset: function() {
                var model = this.model;
                var self = this;
                var s = this._s;
                _.each(this.defaultData, function(defaultValue, key) {
                    s[key].call(self, _.isArray(defaultValue) ? defaultValue.slice() : defaultValue);
                });
            }
        }
    )
})