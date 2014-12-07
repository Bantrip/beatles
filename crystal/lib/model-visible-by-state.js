define(function(require) {
    var ko = require('knockout');
    var _ = require('lodash');

    var pathIsMatch = function(currentPath, modelPaths) {
        return modelPaths.some(function(modelPath) {
            return suffixSlash(currentPath || '').indexOf(suffixSlash(modelPath)) === 0;
        });
    };

    // force suffix slash
    var suffixSlash = function(s) {
        if (s.charAt(s.length - 1) !== '/') {
            return s + '/';
        }
        return s;
    };

    var notifyStateChangeRecursively = function(model, path, query) {
        var notify = function() {    
            if (model.handleState) {
                model.handleState(query, path);
            }
            model['__children'].peek().forEach(function(child) {
                notifyStateChangeRecursively(child, path, query);
            });
        };

        if (model.__path.length) {
            if (pathIsMatch(path, model.__path)) {
                notify();
                // 在手机上，如果不设延时的话，会导致本该隐藏的模块还显示
                // 这里做一个不明就里的bug fix
                // setTimeout(function() {
                    model['__active'](true);
                // }, 100)
            } else {
                model['__active'](false);
            }
        } else {
            notify();
        }
    };

    var ensureModelPathIsArray = function(model) {
        model.__path = model.__path ?
                        _.isArray(model.__path) ?
                            model.__path
                            : [model.__path]
                        : [];
    };

    return function(loader, state) {

        ko.computed(function() {
            var data = state.data();
            var path = data.path;
            ko.dependencyDetection.ignore(function() {
                loader.roots.forEach(function(root) {
                    notifyStateChangeRecursively(root, data.path, data.query);
                })
            });
        });

        loader.initComponent = function(model) {

            var data = state.data();
            var path = data.path, query = data.query;
            ensureModelPathIsArray(model);            

            var pathIsMatched = !model.__path.length || pathIsMatch(path, model.__path);

            var originHandleState = model.handleState;

            model.handleState = function() {
                this.__init();
                if (originHandleState) {
                    originHandleState.apply(this, arguments);
                }
                this.handleState = originHandleState;
            };

            if (pathIsMatched) {
                if (model.handleState) {
                    model.handleState(query, path);
                }
            }

            if (model.__path.length) {   
                model['__active'] = ko.observable(pathIsMatched);  
                model.template = '<!-- ko if: __active -->' + model.template + '<!-- /ko -->';
            }
        };

    }
})