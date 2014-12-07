define(function(require) {
    var $ = require('jquery');
    var ko = require('knockout');

    var Typeahead = $.fn.typeahead.Constructor;
    
    var Mixin = require('crystal/lib/mixin');

    var RemoteDataTypeahead = Mixin.extend(
        Typeahead,
        function() {
            var self = this;
            this.$element.bind('click', function() {
                self.lookup();
            });
            this.valueTextDict = {};
        },
        {
            lookup: function (event) {
                this.selectedValue = false;
                this.query = this.$element.val().trim();
                var items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source
                return items ? this.process(items) : this
            },

            move: function (e) {
              if (!this.shown) return

              switch(e.keyCode) {
                case 9: // tab
                case 13: // enter
                case 27: // escape
                  e.preventDefault()
                  break

                case 38: // up arrow
                  e.preventDefault()
                  this.prev()
                  break

                case 40: // down arrow
                    // 按住shift键输入小括号时,同样也是40,这里过滤折中情况情况
                    if (!e.shiftKey) {
                        e.preventDefault()
                        this.next()
                    }
                  
                  break
              }

              e.stopPropagation()
            },

            select: function() {
                var val = this.$menu.find('.active').attr('data-value')
                this.selectedValue = val;
                this.$element
                  this.$element
                    .val(this.updater(val))
                    .change()
                  return this.hide()

            },

            process: function (items) {
              var that = this
              items = $.grep(items, function (item) {
                return that.matcher(item)
              })

              items = this.sorter(items)

              if (!items.length) {
                return this.shown ? this.hide() : this
              }

              return this.render(items.slice(0, this.options.items)).show()
            },

            updater: function(value) {
                return this.valueTextDict[value];
            },

            matcher: function(item) {
                var query = this.query.toLowerCase();
                if (!query.length) {
                    return true;
                }
                return item.text.toLowerCase().indexOf(query) === 0;
            },
            sorter: function(items) {
                return items;
            },
            render: function (items) {
                var that = this

                items = $(items).map(function (i, item) {
                    var text = item.text;
                    var value = item.value;

                    that.valueTextDict[value] = text;

                    i = $(that.options.item).attr('data-value', value)
                    i.find('a').html(that.highlighter(text))
                    return i[0]
                });

                items.first().addClass('active')
                this.$menu.html(items)
                return this
            }
        }
    );


    return {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
            var options = valueAccessor();

            var source = function(key, callback) {
                options.source.call(viewModel, key, callback);
            };

            var ac = new RemoteDataTypeahead(element, {
                source: source,
                items: options.items
            });

            var $element = $(element);
            var obValue = options.value;
            var obText = options.text;

            var updateObservable = function() {
                if (ac.selectedValue) {                                
                    obValue(ac.selectedValue);
                    obText($element.val());
                } else {                        
                    obValue(undefined);           
                    obText('');
                    $element.val('');
                }            
            }

            $element.bind('change', updateObservable);

            $element.bind('blur', function() {
                // 因为在下拉列表上点击可触发blur事件,所以在这里加个延时,以取得真正的值
                setTimeout(updateObservable, 200);                
             });
        },

        update: function(element, valueAccessor) {
            var options = valueAccessor();
            $(element).val(ko.utils.unwrapObservable(options.text));
        }
    };

});