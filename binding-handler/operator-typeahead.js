define(function(require) {
    var ko = require('knockout');

    require('./typeahead');
    var remote = require('app/remote');

    var bindingTypeahead = ko.bindingHandlers.typeahead;

    return {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
            bindingTypeahead.init.call(bindingTypeahead, element, function() {
                return {
                    text: viewModel.operatorName,
                    value: viewModel.operatorId,
                    items: 15,
                    source: function(text, callback) {
                        remote.search.operator({
                            param: {
                                keyword: text,
                            }
                        }, notifyOnError(function(data) {
                            callback(data.operatorList.map(function(item) {
                                return {
                                    value: item.value,
                                    text: item.text
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
                    text: viewModel.operatorName,
                    value: viewModel.operatorId
                }
            });
        }
    }
})