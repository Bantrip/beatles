define(function(require) {
    var _ = require('lodash');
    var ko = require('knockout');

    var templateBindingHandler = ko.bindingHandlers.template;

    var makeTemplate = function(opt, viewModel) {
        return function() {
            var o = {};

            _.each(options, function(modelPropertyName, templatePropertyName) {
                if (_.isString(modelPropertyName) &&  modelPropertyName in viewModel) {
                    var property = viewModel[modelPropertyName];

                    o[templatePropertyName] = (!ko.isObservable(property) && typeof property === 'function') ? function() {
                        return property.apply(viewModel, arguments);
                    } : property;
                } else {
                    o[templatePropertyName] = modelPropertyName;
                }
            });

            return _.extend(o, opt);
        }
    };

    var options = {};

    return _.reduce(['init', 'update'], function(ret, name) {

        ret[name] = function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            
            templateBindingHandler[name](element, makeTemplate(valueAccessor(), viewModel), allBindingsAccessor, viewModel, bindingContext);

            return {
                controlsDescendantBindings: true
            };
        }

        return ret;
    }, {
    	allowVirtual: true,

        config: function(opt) {
            _.extend(options, opt);
        }
    });
});