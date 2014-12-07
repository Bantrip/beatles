define(function (require) {
    var addBindingHandler = require('crystal-extra/add-binding-handler');
    var loader = require('./loader');

    addBindingHandler('children', require('crystal-extra/binding-handler/children'), {
        foreach: '__children',
        name: function(child) {
            return child.template;
        }
    });
    addBindingHandler('stateRef', require('crystal-extra/binding-handler/state-ref'));
    addBindingHandler('checkAll', require('crystal-extra/binding-handler/check-all'));
    addBindingHandler('delegateEvent', require('crystal-extra/binding-handler/delegate-event'));
    addBindingHandler('datePicker', require('crystal-extra/binding-handler/date-picker'));
    addBindingHandler('upload', require('binding-handler/upload'));
    addBindingHandler('autosize', require('binding-handler/autosize'));
    addBindingHandler('typeahead', require('binding-handler/typeahead'));
    addBindingHandler('customerTypeahead', require('binding-handler/customer-typeahead'));
    addBindingHandler('shopNameTypeahead', require('binding-handler/shop-name-typeahead'));
    addBindingHandler('operatorTypeahead', require('binding-handler/operator-typeahead'));
    addBindingHandler('brandTypeahead', require('binding-handler/brand-typeahead'));
    
})