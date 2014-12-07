define(function(require) {
    var $ = require('jquery');
    var ko = require('knockout');

    var Dialog = $.fn.modal.Constructor;

    var $win = $(window);
    var DIALOG_COMPONENT_HEIGHT = 50 /* head */ + 60 /* footer */ + 30 /* padding *2 */;
    var DIALOG_MARGIN = 50 * 2;
    var DEFAULT_DIALOG_MODE = 'auto';

    var enableFocus = function(dialog, $element) {
        var focusSelector = $element.attr('data-dialog-focus');

        if (focusSelector) {
            var showDialog = dialog.show;

            var tryAutoFocus = function(tryAutoFocusCount) {
                if (tryAutoFocusCount-- === 0) {
                    return;
                }       

                setTimeout(function() {
                    var elemToFucus = $element.find(focusSelector)[0];

                    if (elemToFucus) {
                        try {
                            elemToFucus.focus();
                        } catch (e) {
                            // do nothing
                        }                        
                    } else {
                        tryAutoFocus(tryAutoFocusCount);
                    }                   
                }, 300);
            };

            dialog.show = function() {
                showDialog.apply(this, arguments);
                tryAutoFocus(5);
            };
        }
    };   

    return function(element) {
        var $element = $(element);

        var dialog = new Dialog($element, {
            backdrop: 'static',
            keyboard: false
        });

        $element.css({
            top: '50%'
        });

        var dialogMode = $element.attr('data-dialog-mode') || DEFAULT_DIALOG_MODE;

        if (dialogMode === 'fixed-size') {
            var width = $element.outerWidth();
            var height = $element.outerHeight();

            $element.css({
                marginTop:  -height / 2,
                marginLeft: -width/ 2
            });  
        } else if (dialogMode === 'fixed-position') {
            $element.css({
                top: '10%',
                marginLeft: -$element.outerWidth() / 2
            });
        } else {
            // 内容可能会动态改变大小
            // 所以用设置固定的margin来对齐
            var $body = $element.find('.modal-body');       
            var resize = function() {      
                var dialogHeight = $win.outerHeight() - DIALOG_MARGIN;  
                var dialogBodyHeight = dialogHeight - DIALOG_COMPONENT_HEIGHT;

                $body.css({
                    height: dialogBodyHeight,
                    maxHeight: dialogBodyHeight
                });

                $element.css({
                    marginTop:  -dialogHeight / 2,
                    marginLeft: -$element.outerWidth() / 2
                });
            };

            $win.bind('resize', resize);
            resize();   
        }

        $element.hide();

        enableFocus(dialog, $element);

        return dialog;
    }


})