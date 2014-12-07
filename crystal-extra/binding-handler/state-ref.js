define(function(require) {
    var ko = require('knockout');
    var hashParser = require('crystal/lib/util/hash-parser');

	return {
		update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
            element.href = hashParser.stringify(ko.toJS(valueAccessor()));
        }
	}
});