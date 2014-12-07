var slice = [].slice;
var forEach = [].forEach;
var reduce = [].reduce;

var noop = function () {};

var detachCallback = function(fn) {
    return function() {
        var a = arguments;
        var c = a.length - 1;
        return fn.call(this, slice.call(a, 0, c), a[c]);
    };
};

module.exports = {
    concat: function () {
        var fns = arguments;
        var fnsLength = fns.length;

        return detachCallback(function(initArgs, callback) {
            var i = 0;

            var next = function(err) {
                if (err || i === fnsLength) {
                    callback.apply(this, arguments);
                } else {
                    var result = fns[i++].apply(this, slice.call(arguments, 1).concat([next]));
                    if (result !== undefined) {
                        next.call(this, null, result);
                    }  
                }
            };

            return next.apply(this, [null].concat(initArgs));
        })
    },

    group: function(reducer) {

        return function(items, callback) {
            var len = items.length;

            if (!len) {
                callback.call(this, null, []);
                return;
            }

            var self = this;

            var results = [];

            var check = function (index, args) {
                if (!results[index]) {
                    len -= 1;
                    results[index] = args;
                    if (len === 0) {
                        callback.call(self, null, results.reduce(function (ret, items) {
                            return ret.concat(items);
                        }));
                        results.length = 0;
                        results = null;
                        check = noop;
                    }
                }
            };

            var hasError = false;
            forEach.call(items, function (item, i) {
                reducer.call(self, item, function (err) {
                    if (hasError) {
                        return;
                    }
                    if (err) {
                        callback.call(self, err);
                        hasError = true;
                        return;
                    }
                    check(i, slice.call(arguments, 1));
                })
            });
        }
    },

    memo: function(handle, cacheKeyGenerator) {
        var cache = {};
        var pendings = {};

        if (!cacheKeyGenerator) {
            cacheKeyGenerator = JSON.stringify;
        }

        var applyCache = function(o, fn) {
            fn.apply(o.scope, o.args);
        };

        return detachCallback(function(args, callback) {
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
        })
    }
}