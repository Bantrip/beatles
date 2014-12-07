define(function(require) {
    var load;
    var ko = require('knockout');
    var _ = require('lodash');
    var setDomNodeChildren = ko.virtualElements.setDomNodeChildren;
    var childNodes = ko.virtualElements.childNodes;
    var emptyDomNode = ko.utils.emptyDomNode;
    var parseHtmlFragment = ko.utils.parseHtmlFragment;
    var slice = [].slice;

    var innerHTMLContainer = document.createElement('div');

    var cleanInnerHTML = function(element) {
        emptyDomNode(innerHTMLContainer);

        _.each(slice.call(childNodes(element)), function(child) {
            innerHTMLContainer.appendChild(child);
        });
        
        return innerHTMLContainer.innerHTML;
    };

    return {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var innerHTML = cleanInnerHTML(element);

            load(valueAccessor(), function(instance) {              
                instance.$parent = viewModel;
                instance.$content = innerHTML;
                setDomNodeChildren(element, parseHtmlFragment(instance.template));
                ko.applyBindingsToDescendants(instance, element);  
            });       

            return {
                controlsDescendantBindings: true
            };     
        },

        config: function(options) {
            load = options.load
        },

        allowVirtual: true
    }
})