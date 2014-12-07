define(function(require) {
    var _ = require('lodash');
    var ko = require('knockout');

    var unwrapObservable = ko.utils.unwrapObservable;

    return {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
            var checkedProperty = allBindingsAccessor().checkedProperty || 'checked';
            var disabledProperty = allBindingsAccessor().disabledProperty; 

            ko.utils.registerEventHandler(element, 'click', function() {
                var checked = this.checked;

                unwrapObservable(valueAccessor()).forEach(function(o) {
                    if (!(disabledProperty && o[disabledProperty]())) {
                        o[checkedProperty](checked);
                    }
                });
            });
        },

        update: function(element, valueAccessor, allBindingsAccessor) {
            var checkedProperty = allBindingsAccessor().checkedProperty || 'checked';
            var disabledProperty = allBindingsAccessor().disabledProperty; 

            var hasChecked = false, hasUnchecked = false;

            unwrapObservable(valueAccessor()).forEach(function(o) {
                if (disabledProperty && o[disabledProperty]()) {
                    return;
                }

                if (o[checkedProperty]()) {
                    hasChecked = true;
                } else {
                    hasUnchecked = true;
                }
            });

            if (!hasChecked) {
                element.indeterminate = false;
                element.checked = false;
                return;
            }

            if (!hasUnchecked) {
                element.indeterminate = false;
                element.checked = true;
                return;
            }

            element.indeterminate = true;
            element.checked = false;
        }
    }

})