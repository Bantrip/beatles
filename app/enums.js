define(function (require) {
    var _ = require('lodash');

    return function(enums) {
        _.forEach(enums.mapping, function(arr, propertyName) {
            var mapping = arr.mapping = {};
            arr.forEach(function(item) {
                mapping[item.value] = item.text;
            });
        });
    }

    
})