define(function(require) {
    var ko = require('knockout');
    var noop = function() {};

    // var getElement = function(arr) {
    //     for (var i = 0; i < arr.length; i++) {
    //         if (arr[i].nodeType === 1) {
    //             return arr[i];
    //         }
    //     }
    // };

    var parseTemplate = function(html) {
        var fragments = ko.utils.parseHtmlFragment(html);
        for (var i = 0; i < fragments.length; i++) {
            if (fragments[i].nodeType === 1) {
                return fragments[i];
            }
        }
    }

    return require('crystal/lib/component').extend({
        open: function(data, callback) {
            this.__dialogCallback = callback || noop;
            this.handleOpen(data);
            this.__dialog.show();
        },

        handleOpen: function(data) {
            this.setData(data);
        },

        callback: function() {
            this.__dialog.hide();
            this.__dialogCallback.apply(this, arguments);
        },

        close: function() {
            this.callback();
        },

        confirm: function() {            
            this.callback(this.getData());
        },

        buildDialogElement: function() {
            throw new Error('to be implement');
        },

        render: function() {
            var element = parseTemplate(this.template);
            document.body.appendChild(element);

            ko.applyBindings(this, element);
            this.__dialog = this.buildDialogElement(element);
        }
    })

})