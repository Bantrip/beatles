define(function(require) {
    var ko = require('knockout');
    var async = require('crystal/lib/util/async');
    var Mixin = require('crystal/lib/mixin');

    return function(loader, buildDialogElement) {
        var DialogModel = require('./model').extend({
            buildDialogElement: buildDialogElement
        });
        
        var activeDialogs = [];
        var loadDialog = async.memo(async.concat(
            function(type, callback) {
                loader.loadComponentClass(type, callback);
            },
            function(Model, next) {
                var model = DialogModel.extend(Model).create();
                model.render();
                
                var doCallback = model.callback;

                // override callback for automatic close dialog on state change
                model.callback = function() {
                    doCallback.apply(this, arguments);

                    var index = activeDialogs.indexOf(this);
                    if (index !== -1) {
                        activeDialogs.splice(index, 1);
                    }
                };

                next(model);
            }
        ));

        ko.utils.registerEventHandler(window, 'hashchange', function() {
            activeDialogs.slice().forEach(function(activeDialog) {
                activeDialog.close();
            })
        });

        return function(type) {
            return function(data, callback) {
                loadDialog(type, function(dialog) {                    
                    dialog.open(data, callback);
                    activeDialogs.push(dialog);
                });
            }
        };

    };
})