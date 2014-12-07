define(function(require) {
    var ko = require('knockout');

    require('./typeahead');
    var remote = require('app/remote');

    var bindingTypeahead = ko.bindingHandlers.typeahead;

    return {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
            bindingTypeahead.init.call(bindingTypeahead, element, function() {
                return {
                    text: viewModel.customer,
                    value: viewModel.customer,
                    items: 15,
                    source: function(text, callback) {
                        remote.search.customer({
                            param: {
                                keyword: text,
                                cityId: viewModel.cityId()
                            }
                        }, notifyOnError(function(data) {
                            callback(data.customerList.map(function(item) {
                                return {
                                    value: item,
                                    text: item
                                }
                            }));
                        }));
                    }
                }
            }, allBindingsAccessor, viewModel)
        },

        update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
            bindingTypeahead.update.call(bindingTypeahead, element, function() {
                return {
                    text: viewModel.customer,
                    value: viewModel.customer
                }
            });
        }
    }
})