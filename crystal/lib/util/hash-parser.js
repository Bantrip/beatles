define(function(require) {
    var queryParser = require('./query-parser');
    var _ = require('lodash');

    /*

    #/a/b?c=1&d=2 
    
    <==>
    
    {
        path: '/a/b',
        query: {
            c: '1',
            d: '2'
        }
    }    
    
    */
    return {
        parse: function(str) {     
            var parts = str.replace(/^#/, '').split('?');

            return {
                path: parts[0],
                query: parts[1] ? queryParser.parse(parts[1]) : {}
            }
        },

        stringify: function(data) {
            var query;
            var str = data.path || '';
            if (!_.isEmpty(data.query)) {
                query = queryParser.stringify(data.query);
                str += '?' + query;
            }         
            return '#' + str;
        }
    }
})