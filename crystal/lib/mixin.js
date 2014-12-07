define(function(require, exports, module) {
    var _ = require('lodash');
    var slice = [].slice;

    var INITS = '__inits';

    var setMixinConstructors = function(o, optFns) {
        o[INITS] = optFns;
    };

    var getMixinConstructors = function(o) {
        return o[INITS];
    };

    var buildMixin = function() {

        var Mixin = function() { 
            var self = this, args = arguments;
            _.each(getMixinConstructors(Mixin), function(init) {
                init.apply(self, args);
            });
        };

        setMixinConstructors(Mixin, []);

        return Mixin;
    };

    var Abstract = function() {};

    // 避免把Abstract本身作为构造函数
    setMixinConstructors(Abstract, []);

    _.extend(Abstract, {
        mix: function() {
            var self = this;
            var proto = this.prototype;

            var inits = getMixinConstructors(this);

            _(arguments).flatten().each(function(o) {
                if (!o) {
                    return;
                }

                if (typeof o === 'function') {
                    var srcProto = o.prototype;

                    var srcMixinConstructors = getMixinConstructors(o);

                    if (srcMixinConstructors) {
                        inits.push.apply(inits, srcMixinConstructors);
                    } else {
                        inits.push(o);
                    }

                    _.extend(proto, srcProto);
                    _.extend(self, o);
                    return;
                }

                if (typeof o === 'object') {
                    _.extend(proto, o);
                    return;
                }                    
            });

            setMixinConstructors(this, _.uniq(inits));
            proto.constructor = this;

            return this;
        },       
        
        extend: function() {    
            return this.mix.apply(buildMixin(), [this].concat(slice.call(arguments)));
        },

        create: function() {
            var instance = Object.create(this.prototype);
            this.apply(instance, arguments);
            return instance;
        }
    });

    module.exports = Abstract.extend();

});

