define(function(require) {
    var ko = require('knockout');

    require('./typeahead');
    var remote = require('app/remote');

    var bindingTypeahead = ko.bindingHandlers.typeahead;

    return {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
            bindingTypeahead.init.call(bindingTypeahead, element, function() {
                return {
                    text: viewModel.brandName,
                    value: viewModel.brandId,
                    items: 15,
                    source: function(text, callback) {
                        remote.search.brand({
                            param: {
                                brandName: text,
                            }
                        }, notifyOnError(function(data) {
                            callback(data.brandList.map(function(item) {
                                return {
                                    value: item.brandId,
                                    text: item.brandName
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
                    text: viewModel.brandName,
                    value: viewModel.brandId
                }
            });
        }
    }
})