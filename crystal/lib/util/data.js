define(function(require) {
    var _ = require('lodash');
    var ko = require('knockout');
    var ob = ko.observable;
    var oba = ko.observableArray;
    var peekObservable = ko.utils.peekObservable;

    var getObjectData = function(target) {
        return _.reduce(getDataPropertyNames(target), function(all, key) {                   
            all[key] = getData(target[key]);
            return all;
        }, {});
    };

    var isWriteable = function(ob, key) {
        if (!ko.isWriteableObservable(ob)) {
            return false;
        }

        if (key.charAt(0) === '_') {
            return false;
        }

        return true;
    };

    var getDataPropertyNames = function(target) {
        var names = [];
        _.each(target, function(o, key) {
            if (isWriteable(o, key)) {
                names.push(key);
            }
        });
        return names;
    };

    var getData = function (o) {
        o = peekObservable(o);

        if (!o) {
            return o;
        }

        if (_.isArray(o)) {
            return o.map(function(oo) {
                return getData(oo);
            })
        }

        if (_.isObject(o)) {
            return getObjectData(o);
        }

        return o;
    };

    var setData = function(model, o) {
        if (!o) {
            return;
        }
        _.each(o, function(value, key) {
            var ob = model[key];
            if (isWriteable(ob, key)) {
                ob(value);
            }
        })
    };

    return {
        getData: getData,
        setData: setData,
        observable: function(model, props) {
            _.each(props, function(value, key) {
                model[key] = ko.observable(value);
            });
        },
        observableArray: function(model, props) {
            _.each(props, function(value, key) {
                model[key] = ko.observableArray(value);
            });
        },
        computed: function(model, props) {
            _.each(props, function(value, key) {
                model[key] = ko.computed(value, model);
            });
        }
    };
})