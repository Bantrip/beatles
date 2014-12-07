define(function(require, exports, module) {
var slice = [].slice;
var forEach = [].forEach;
var push = [].push;
var reduce = [].reduce;

var noop = function () {};

var concat = function() {
    var fns = arguments;
    return function() {
        var i = 0;
        var context = this;
        var callback = arguments[arguments.length - 1];

        var next = function() {
            if (i === fns.length) {
                callback.apply(context, arguments);
            } 
            else {
                push.call(arguments, next);
                fns[i++].apply(context, arguments);
            }            
        };

        next.apply(null, slice.call(arguments, 0, 1));
    }
};

var map = function(reducer) {

    return function(items, callback) {
        var len = items.length;

        if (!len) {
            callback.call(this, []);
            return;
        }

        var self = this;

        var results = [];

        var check = function (index, args) {
            if (!results[index]) {
                len -= 1;
                results[index] = args;
                if (len === 0) {
                    callback.call(self, results.reduce(function (ret, items) {
                        return ret.concat(slice.call(items));
                    }, []));
                    results.length = 0;
                    results = null;
                    check = noop;
                }
            }
        };

        forEach.call(items, function (item, i) {
            reducer.call(self, item, function () {           
                check(i, arguments);
            })
        });
    }
};

var memo = function(handle, cacheKeyGenerator) {
    var cache = {};
    var pendings = {};

    if (!cacheKeyGenerator) {
        cacheKeyGenerator = JSON.stringify;
    }

    var applyCache = function(o, fn) {
        fn.apply(o.scope, o.args);
    };

    return function() {
        var callback = arguments[arguments.length - 1];
        var args = slice.call(arguments, 0, arguments.length - 1);
        var key = cacheKeyGenerator(args);

        var hitCache = cache[key];
        if (hitCache) {
            // ensure async
            setTimeout(function() {
                applyCache(hitCache, callback);
            });                
            return;
        } 

        if (pendings[key]) {
            pendings[key].push(callback);
            return;
        }

        pendings[key] = [];
        pendings[key].push(callback);

        handle.apply(this, args.concat([function() {
            var hitCache = cache[key] = {
                args: arguments,
                scope: this
            };
            
            pendings[key].forEach(function(handle) {
                applyCache(hitCache, handle);
            });

            pendings[key].length = 0;
            delete pendings[key];
        }]));
    }
}

return {
    concat: concat,
    map: map,
    memo: memo
};

});