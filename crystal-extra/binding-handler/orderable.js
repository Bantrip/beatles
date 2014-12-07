define(function(require) {
    var _ = require('lodash');
    var $ = require('jquery');
    var ko = require('knockout');  

    var config = {
        defaultOrder: 'desc'
    };

    return {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            $(element).append('<i class="icon-arrow-up"></i><i class="icon-arrow-down"></i>');
            var $element = $(element);
            $element.addClass('orderable');

            var opt = valueAccessor();    
            var order = opt.order;
            var orderBy = opt.orderBy;       
            var field = opt.field;
            var change = opt.change;

            $element.bind('click', function() {
                if (orderBy() === field) {
                    order(order() === 'asc' ? 'desc' : 'asc');
                } else {
                    orderBy(field);
                    order(config.defaultOrder);
                }
                change.call(viewModel);
            });         

            ko.computed(function() {
                $element.removeClass('asc desc');
                if (field === orderBy()) {
                    $element.addClass(order() === 'asc' ? 'asc' : 'desc');
                }
            }) 
        },

        config: function(_config) {
            _.extend(config, _config);
        }
    };

});
