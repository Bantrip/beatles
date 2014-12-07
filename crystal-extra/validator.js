define(function(require) {
    var _ = require('lodash');
    var Class = require('crystal/lib/mixin');
    var ko = require('knockout');
    var peekObservable = ko.utils.peekObservable;

    var Validator = Class.extend(
        function(model, key, validators) {
            this.model = model;
            this.key = key;
            this.validators = validators;
            this.messages = ko.observableArray();

            var self = this;
            this.isValid = ko.computed(function() {
                return self.messages().length === 0;
            });
        },
        {
            validate: function() {
                var model = this.model;
                var ob = model[this.key];

                if (!ob) {
                    return;
                }

                var value = peekObservable(ob);
          
                this.messages(this.validators.reduce(function(msgs, fn) {
                    var msg = fn(value, model);
                    if (msg) {
                        msgs.push(msg)
                    }
                    return msgs;
                }, []));
            },

            clear: function() {
                this.messages([]);
            }
        }
    );

    var nullValidator = new Validator();
    nullValidator.validate = function() {};

    var Factory = Class
        .extend(
            function(model, config) {
                var self = this;
                var validatorsObject = this.validators = {};
                _.each(config, function(validators, key) {
                    validatorsObject[key] = self[key] = new Validator(model, key, validators);
                });

                this.isValid = ko.computed(function() {
                    var isValid = true;
                    _.each(validatorsObject, function(validator) {
                        if (!validator.isValid()) {
                            isValid = false;
                        }
                    });
                    return isValid;
                });
            },
            {
                validate: function() {
                    _.each(this.validators, function(validator) {
                        validator.validate();
                    });
                },

                clear: function() {
                    _.each(this.validators, function(validator) {
                        validator.clear();
                    });
                }
            }
        )
    
    Factory.nullValidator = nullValidator;

    return Factory;
});