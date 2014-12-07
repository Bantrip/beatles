define(function () {

    // var parser = document.createElement('a');
    // parser.href = "http://example.com:3000/pathname/?search=test#hash";

    // parser.protocol; // => "http:"
    // parser.hostname; // => "example.com"
    // parser.port;     // => "3000"
    // parser.pathname; // => "/pathname/"
    // parser.search;   // => "?search=test"
    // parser.hash;     // => "#hash"
    // parser.host;     // => "example.com:3000"

    var parseUrl = function (url) {
        var parser = document.createElement('a');
        parser.href = url;
        return parser;
    };

    return parseUrl(seajs.data.base).hostname === location.hostname;
})