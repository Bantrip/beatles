define(function(require) {

    var $ = require('jquery');
    var ko = require('knockout');
    require('autosize');

    return {
        init: function(element, valueAccessor) {
            $(element).autosize(valueAccessor());
        },

        update: function(element) {
            setTimeout(function() {
                $(element).trigger('autosize.resize');
            }, 100)
        }
    }
})