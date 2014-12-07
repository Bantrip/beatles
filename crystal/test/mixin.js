define(function(require) {
    var _ = require('lodash')

    var Mixin = require('crystal/mixin').extend();


    var MixinA;
    var objectMixin;

    describe('Mixin', function() {

        beforeEach(function() {
            MixinA = Mixin.extend();
            objectMixin = {
                a: 1,
                b: [],
                c: function() {

                },
                d: [{
                    d: function() {

                    }
                }]
            }
        });

        describe('::mix()', function() {
            it('should not be change if no mixin applied', function() {
                var before = JSON.stringify(MixinA.prototype);
                MixinA.mix();
                var after = JSON.stringify(MixinA.prototype);   
                expect(after).eql(before)
            });

            it('should apply object', function() {
                MixinA.mix(objectMixin);
                var proto = MixinA.prototype;

                _.each(objectMixin, function(value, key) {
                    expect(proto).have.property(key, value);
                });
            });
        });


        
    });
});