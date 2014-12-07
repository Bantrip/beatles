define(function(require) {
    var skipEmpty = function(fn) {
        return function(value, model) {
            if (value == null || value === '') {
                return;
            }
            return fn(value, model);
        }
    };

    var REG_EMAIL = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var REG_MOBILE = /^0?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/;

    var _ = require('lodash');

    var getChineseWordUTF8Stringlength = function(str) {
        var len = 0;
        _.each(str, function(c, i) {
            if (str.charCodeAt(i) > 127) {
                len += 3;
            } else {
                len += 1
            }
        });
        return len;
    };

    return {
        skipEmpty: skipEmpty,

        required: function(value) {
            if (value == null || value === '') {
                return '必填';
            }
        },

        number: skipEmpty(function(value) {
            if (value - 0 != value) {
                return '必须是数字';
            }
        }),

        email: skipEmpty(function(value) {
            if (!REG_EMAIL.test(value)) {
                return 'E-Mail格式不合法'
            }
        }),

        largeEqualThan: function(min) {
            return skipEmpty(function(value) {
                if (value < min) {
                    return '必须大于等于' + min;
                }
            })
        },

        lessEqualThan: function(max) {
            return skipEmpty(function(value) {
                if (value > max) {
                    return '必须小于等于' + max;
                }
            })
        },

        lengthEqual: function(num) {
            return skipEmpty(function(value) {
                if (value.length !== num) {
                    return '文字数量必须等于' + num;
                }
            })
        },

        lengthLessEqualThan: function(num) {
            return skipEmpty(function(value) {
                if (value.length > num) {
                    return '文字数量必须小于等于' + num;
                }
            })
        },

        UTF8LengthLessEqualThan: function(num) {
            return skipEmpty(function(value) {
                if (getChineseWordUTF8Stringlength(value) > num) {
                    return '文字数量不超过' + num + '个字母或者' + Math.floor(num / 3) + '个汉字';
                }
            })
        },

        mobile: skipEmpty(function(value) {
            if (!REG_MOBILE.test(value)) {
                return '手机号码格式不合法'
            }
        })
    }
})