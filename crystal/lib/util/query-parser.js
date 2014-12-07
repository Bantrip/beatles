define(function(require) {
	var _ = require('lodash');

    /*
        c=1&d=2 
        
        <==>
        
        {
            c: '1',
            d: '2'
        }
    */

	return {
		parse: function(str) {
			var o = {};
            str.split('&').forEach(function(keyValue) {
                var arr = keyValue.split('=');
                o[decodeURIComponent(arr[0])] = decodeURIComponent(arr[1]);
            });
            return o;
		},

		stringify: function(o) {
			var arr = [];
            _.each(o, function(value, key) {
                if (value != null) {
                    if (typeof value === 'object') {
                        value = JSON.stringify(value);
                    }
                    arr.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
                }
            });
            return arr.join('&');
		}
	}

})