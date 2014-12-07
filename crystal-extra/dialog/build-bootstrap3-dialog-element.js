define(function(require) {
    var $ = require('jquery');
    var ko = require('knockout');

    var Dialog = $.fn.modal.Constructor;

    return function(element) {
        var $element = $(element);

        var dialog = new Dialog($element, {
            backdrop: 'static',
            keyboard: false
        });

        $element.hide();

        return dialog;
    }

})