define(function(require) {
    var _ = require('lodash');
    var ko = require('knockout');
    require('./util/ko-string-template');
    var subscribable = ko.subscribable;
   
    var async = require('./util/async');

    var concat = async.concat;
    var map = async.map;
    var memo = async.memo;

    var noop = function() {};

    var Mixin = require('./mixin');
    var ComponentBase = require('./component');
    
    var buildTagReg = function(tag) {
        return new RegExp('<' + tag + '(?:[^>]*)>([\\s\\S]*?)<\\/' + tag + '>', 'ig');
    };

    var buildTypeComment = function(type) {
        return '\n\n    /* ' + type + ' */\n\n    '
    };

    var REG_SCRIPT_TAG = buildTagReg('script');
    var REG_STYLE_TAG = buildTagReg('style');

    // borrow from seajs
    var REQUIRE_RE = /"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^\/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*Component|(?:^|[^$])\bComponent\s*\(\s*(["'])(.+?)\1\s*\)/g
    var SLASH_RE = /\\\\/g;

    var parseDependencies = function(code) {
        var ret = [], m
        REQUIRE_RE.lastIndex = 0
        code = code.replace(SLASH_RE, '')

        while ((m = REQUIRE_RE.exec(code))) {
          if (m[2]) ret.push(m[2])
        }

        return _.uniq(ret)
    };

    var getComponentByType = function(type) {
        var Class = loader._classes[type];
        if (!Class) {
            throw new Error('Component:' + type + ' has not loaded');
        }
        return Class
    };

    var evaluateScirpt = function(str) {
        var exports = {};        
        try {
            Function.apply(Function.prototype, ['exports', 'Component', str]).apply(exports, [exports, getComponentByType]);
            return exports;
         } catch (e) {
            throw new Error(e.toString() + str);
        }
    };

    var loadDeps = function(str, callback) {
        var deps = parseDependencies(str);
        if (deps.length) {
            map(loader.loadComponentClass)(deps, callback);
        } else {
            callback();
        }
    }

    var parseScript = function(type, template, mixins, next) {
        var scriptString = '';

        template = template.replace(REG_SCRIPT_TAG, function(a, b) {
            scriptString += '\n' + b.trim();
            return '';
        });

        if (scriptString) {
            loadDeps(scriptString, function() {
                var exports = evaluateScirpt(buildTypeComment(type) + scriptString);  
                if (_.isArray(exports.model)) {
                    mixins.push.apply(mixins, exports.model);
                } else {
                    mixins.push(exports.model)
                }
                next(type, template, mixins);
            })            
        } else {
            next(type, template, mixins);
        }
    };

    var head = document.getElementsByTagName('head')[0];

    var createCSSByText = function(styles) {
        var css;

        css = document.createElement('style');
        css.media = 'screen';
        head.appendChild(css);

        if (css.styleSheet) { // IE
            try {
                css.styleSheet.cssText = styles;
            } catch (e) {
                throw new(Error)("Couldn't reassign styleSheet.cssText.");
            }
        } else {
            (function (node) {
                if (css.childNodes.length > 0) {
                    if (css.firstChild.nodeValue !== node.nodeValue) {
                        css.replaceChild(node, css.firstChild);
                    }
                } else {
                    css.appendChild(node);
                }
            })(document.createTextNode(styles));
        }
    };

    var parseStyle = function(type, template, mixins, next) {
        var styleString = '';

        template = template.replace(REG_STYLE_TAG, function(a, b) {
            styleString += '\n' + b.trim();
            return '';
        });

        if (styleString) {
            createCSSByText(buildTypeComment(type) + styleString);
        }

        next(type, template, mixins);            
    };

    var toConfig = function(model) {
        if (_.isArray(model)) {
            return model.map(toConfig);
        } else {
            return {
                type: model.__type,
                data: model.getData(),
                children: toConfig(model.__children())
            }
        }
    };


    var loader = {
        roots: [],
        _classes: {},
        mixins: {},

        // to be override
        resolveType: function(type) {
            return type;
        },
        
        loadFile: function(type, callback) {
            require.async(type, function(o) {
                if (!o) {
                    throw new Error('Component type: ' + type + ' not exists');
                }
                callback(o);
            });
        },

        toConfig: toConfig,

        render: function(children, container) { 
            var root = loader.buildComponentByConfig(ComponentBase.extend({
                type: 'Root',
                template:'<!-- ko template: { foreach: __children, name: function(child) { return child.template } } --><!-- /ko -->'
            }), {
                children: _.isArray(children) ? children : [children]
            })
            loader.roots.push(root);
            if (!container) {
                container = document.body;
            }

            container.innerHTML = root.template;

            ko.applyBindingsToDescendants(root, container);
            
        },

        buildComponentByConfig: function(Model, config) {
            var model = Object.create(Model.prototype);

            model.__children = ko.observableArray();
            
            if (config.path) {
                model.__path = config.path;
            }

            if (config.mixin) {
                _.extend(model, config.mixin);
            }

            model.__init = function() {
                this.constructor.call(this);

                if (config.children) {
                   loader.loadComponents(config.children, this.__children);
                }

                if (config.data) {
                    this.setData(config.data);
                }
            }

            this.initComponent(model);          

            return model;
        },

        // to be override
        initComponent: function(model) {
            model.__init();
        }
    };    

    loader.loadComponentClass = memo(concat(
        function(type, next) {
            loader.loadFile(loader.resolveType(type), function(template) {
                next(type, template, []);
            });
        },
        parseScript,
        parseStyle,
        function(type, template, mixins, next) {
            mixins.push({
                __type:  type
            });

            template = template.trim();

            if (template) {                
                mixins.push({
                    // template: template.trim()
                    template: '<!-- ' + type + ' Begin -->\n' + template.trim() + '\n<!-- ' + type + ' End -->\n'
                });
            }

            var ComponentClass = loader._classes[type] = ComponentBase.extend(loader.mixins[type], mixins);

            next(ComponentClass);
        }
    ));

    loader.loadComponent = function(config, next) {
        loader.loadComponentClass(config.type, function(Model) {
            next(loader.buildComponentByConfig(Model, config));
        });
    };

    loader.loadComponents = map(loader.loadComponent);


    return loader;

});