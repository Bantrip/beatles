/**
 * # author Kane yunhua.xiao@dianping.com
 */
define(function(require) {
    var $ = require('jquery'),
        _ = require('lodash'),
        ko = require('knockout'),
        Datepicker,
        defaults;

    require('./date-picker/js/bootstrap-datetimepicker');
    require('./date-picker/css/bootstrap-datetimepicker.css');

    Datepicker = $.fn.datetimepicker.Constructor;
    defaults = $.fn.datetimepicker.defaults;

    var noop = function() {};

    var isInModal = function(element) {
        while (element) {
            if (element.className && element.className.indexOf('modal') !== -1) {
                return true;
            }
            element = element.parentNode;
        }
    }

    var DATA_KEY = 'binding-dp';

    return {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
            var $element = $(element),
                observable = valueAccessor(),
                bindings = allBindingsAccessor(), 
                opts =  _.extend({}, defaults, {
                    language: 'zh-CN',
                    format: bindings.format || 'yyyy-mm-dd',
                    autoclose: bindings.autoclose || true,
                    minView: bindings.minView || 'month',
                    startDate: (typeof bindings.startDate == 'function' ? moment(bindings.startDate()).format(this.format) : bindings.startDate)|| -Infinity,
                    endDate: (typeof bindings.endDate == 'function' ? moment(bindings.endDate()).format(this.format) : bindings.endDate)|| Infinity
                }),           
                dp = new Datepicker($element, opts);

            var handleChange = bindings.dateChange || noop;

            $element.data(DATA_KEY, dp);


            if (isInModal(element)) {
                dp.picker.css('z-index', 1060)
            }

            $element.bind('changeDate', function (e) {                    
                if (e.viewMode === opts.viewMode) {
                    dp.hide();
                }

                $element.trigger('change');
            });

            var $handle = $element.next();

            if ($handle.hasClass('input-group-addon')) { 
                $handle .bind('click', function(e) {
                    if ($element.prop('disabled')) {
                        return;
                    }
                    element.focus();
                    dp.show();
                });
            }

            $element.bind('change', function (e) {
                if ($element.val()) {
                    dp.setValue();
                }                                       
                setTimeout(function () {                     
                    observable($element.val());
                    handleChange();
                });
            });

            return { controlsDescendantBindings: true };
        },

        update: function(element, valueAccessor,  allBindingsAccessor, viewModel) {
            var date,
                value = ko.unwrap(valueAccessor()),
                bindings = allBindingsAccessor()
                dp =  $(element).data(DATA_KEY);

            $(element).val(bindings.datePicker() || '');

            if (typeof bindings.startDate == 'function') {
                date = moment(bindings.startDate()).format(bindings.format);
                dp.setStartDate(new Date(date));
                date = moment(bindings.endDate()).format(bindings.format);
                dp.setEndDate(new Date(date)); 
            } else {
                dp.update();
            }

            //$(element).data(DATA_KEY).update();
        }
    };

});