define(function(require) {
	var ko = require('knockout');
	var bindingHandlers = ko.bindingHandlers;
	var allowedBindings = ko.virtualElements.allowedBindings;
	var _ = require('lodash');

	return function(key, value, config) {
		bindingHandlers[key] = value;

		if (value.allowVirtual) {
			allowedBindings[key] = true;
		}
		
		if (config !== undefined && typeof value.config === 'function') {
			value.config(config);
		}
	}
	
})