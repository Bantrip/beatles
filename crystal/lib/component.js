define(function(require) {
    var dataUtil = require('./util/data');
    var ko = require('knockout');
    var _ = require('lodash');

    var Component = require('./mixin').extend(
        {
            template: '',

            getData: function() {
                return dataUtil.getData(this);
            },

            setData: function(o) {
                dataUtil.setData(this, o);
            }
        }
    );

    Component.fromData = function(data) {
        var self = this;
        if (_.isArray(data)) {
            return data.map(function(data) {
                return self.fromData(data);
            })
        } else {
            var instance = this.create();
            instance.setData(data);
            return instance;
        }
    };

    return Component;
})