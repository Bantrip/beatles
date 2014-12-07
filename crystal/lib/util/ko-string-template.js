define(function(require) {
    var ko = require('knockout');    
    var _ = require('lodash');

    var makeTemplateSource = ko.nativeTemplateEngine.prototype.makeTemplateSource;

    ko.setTemplateEngine(_.extend(Object.create(ko.nativeTemplateEngine.prototype), {
        allowTemplateRewriting: false,

        makeTemplateSource: function(template, templateDocument) {
            if (typeof template === 'string') {
                return {
                    text: function() {
                        return template;
                    }
                };
            } else {
                return makeTemplateSource.apply(this, arguments);
            }
        }
    }));
})