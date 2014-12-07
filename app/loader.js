define(function(require) {
    var loader = require('crystal/lib/loader');

    var hyphenize = function(str) {
        return str
            .replace(/\./g, '/')
            .replace(/([a-z])([A-Z])/g, function(all, l, h) {
                return l + '-' + h.toLowerCase();
            })
            .replace(/[A-Z]/g, function(m) {
                return m.toLowerCase();
            })        
    };

    var i = 0;
    var convert = function(type) {
        return 'component/' + hyphenize(type);
    };
           
    loader.resolveType = require('./is-mock') ? function(type) {
        return convert(type) + '.html';
    } : function(type) {
        return require.resolve(convert(type));
        // return require.resolve(convert(type)).replace(/i(\d).dpfile/, function() {
        //     return 'i' + ((i++ % 3) + 1) + '.dpfile';
        // });
    };

    return loader;
})