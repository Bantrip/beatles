define(function (require, exports, module) {
    var _ = require('lodash');
    var global = window;

    var stringifyQuery = function(o) {
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
    };

    return function(method, url) {
        var xhr;

        var request = function(data, callback) {
            xhr = global.ActiveXObject ? new global.ActiveXObject("Microsoft.XMLHTTP") : new global.XMLHttpRequest();        
            
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    // Support local file
                    if (xhr.status > 399 && xhr.status < 600) {
                        callback("Could not load: " + url + ", status = " + xhr.status);
                    } else {
                        callback(null, JSON.parse(xhr.responseText));
                    }
                }
            };

            var serializedData = data ? typeof data === 'string' ? data : stringifyQuery(data) : null;
            
            var headers = {};
            
            var currentUrl = url;
            if (method.toUpperCase() === 'GET') {
                currentUrl += (currentUrl.indexOf('?') === -1 ? '?' : '&') + '_=' + Math.random();
                if (serializedData) {
                    currentUrl += '&' + serializedData;
                }
                serializedData = null;
            } else { // post put
                headers['Content-Type'] = 'application/x-www-form-urlencoded';
            }

            xhr.open(method, currentUrl, true);

            _.each(headers, function(value, key) {
                xhr.setRequestHeader(key, value);
            });

            xhr.send(serializedData);
        };

        request.abort = function() {
            if (xhr && xhr.readyState !== 4) {
                xhr.abort();
            }
        };

        return request;

    }

    

});