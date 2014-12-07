define(function(require) {
    var _ = require('lodash');
    var remote = require('app/remote');

    var inputData = {
        'input': 'data'
    };

    describe('server-api', function() {
        _.each(remote, function(config, bizName) {
            _.each(config, function(action, actionName) {
                it(bizName + ':' + actionName, function(done) {
                    action(inputData, function(err, msg) {
                        expect(msg).not.null;
                        done(err);
                    })
                })
            })
        })
    })

});