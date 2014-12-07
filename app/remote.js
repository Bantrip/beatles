define(function (require) {
    var _ = require('lodash');
    var async = require('crystal/lib/util/async');
    var $ = require('jquery');
    var stringifyQuery = require('crystal/lib/util/query-parser').stringify;
    var concat = async.concat;
    var memo = async.memo;

    var originHttp = require('crystal-extra/http');

    var defaultOptions = {
        memo: false
    };

    var generateRequestDataKey = function (args) {
        if (args[0]) {
            return stringifyQuery(args[0]);
        }
        return '';
    };

    var configPaths = seajs.data.paths;
    var remote = configPaths ? configPaths.remote : '';
    var isMock = require('./is-mock');

    var http = function (method, url) {
        return originHttp(isMock ? 'get' : method, require.resolve(remote + url + '#'));
    };

    var r = function (method, url, options) {

        url += '.json'

        var request = http(method, url);
        var abort = request.abort;

        options = _.extend({}, defaultOptions, options);

        if (options.memo) {
            request = memo(request, generateRequestDataKey);
        }

        var ret = concat(function(data, next) {
            if (!data) {
                data = {};
            }
            next(data);
        }, request, function(err, ret, next) {
            if (err) {
                next = ret;
                next(err);
                return;
            }

            if (ret.code !== 200) {
                next(ret.message || '服务器错误，请重试');
                return;
            }

            next(null, ret.result);
            
        });
        
        ret.abort = abort;

        return ret;
    };

    return {
        enums: r('get', '/product/getEnums'),
        list: r('get', '/product/list'),
        info: r('get', '/product/show'),
        operate: {
            del: r('get', '/product/delete')
        }
    }
})