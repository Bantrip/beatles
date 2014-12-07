define(function(require) {
	require('noty');
	var $ = require('jquery');
	var _ = require('lodash');

	var noop = function() {};

	var getOptions = function(msg) {
		return typeof msg === 'object' ? msg : {
			text: msg
		};
	};

	var animation = {
        open: {height: 'toggle'},
        close: {height: 'toggle'},
        easing: 'swing', 
        speed: 200
	};

	var o = {
		clear: function() {
			$.noty.closeAll();
		}
	};

	['error', 'warning', 'information', 'success'].forEach(function(type) {

		var getAlertOptions = function(msg) {
			var options = getOptions(msg);
			return _.defaults(options, {
				type: type,
				layout: 'topCenter',
				animation: animation
			});
		};

		o[type] = function(msg, timeout) {
			var options = getAlertOptions(msg);
			if (timeout == null) {
				timeout = 1500;
			}

			options.timeout = timeout;
			noty(options);
		};
	});

	return o;
})