define(function(require) {
    var _ = require('lodash');
    var ko = require('knockout');

    return {
        number: function(n) {
            var number = ko.observable(n);

            return {
                set: function(v) {
                    var numberValue = parseFloat(v);
                    number(isNaN(numberValue) ? null : numberValue);
                },

                get: number
            }
        }
    }
});