define(function(require) {
    var _ = require('lodash')
    var Model = require('../lib/model').extend()
    var ko = require('knockout');
    var spy = sinon.spy();

    var ExtendModel = Model.extend(function() {
        this.defineProperties({
            firstName: 'Tom',
            lastName: 'Dwan',
            fullName: function() {
                return this.firstName() + ' ' + this.lastName();
            }
        })
    })



    describe('Model', function() {
        var model;
        beforeEach(function() {
            model = new Model();
            spy.reset();
        })

        describe('#defineProperties(config)', function() {

            it('primary value', function() {
                model.defineProperties({
                    firstName: 'Tom'
                });

                expect(ko.isObservable(model.firstName)).is.true
            })

            it('primary value should subscribable', function() {
                model.defineProperties({
                    firstName: 'Tom'
                });

                model.firstName.subscribe(spy);

                model.firstName('John');

                expect(spy).have.been.calledWith('John');
            })

            it('array', function() {
                model.defineProperties({
                    children: []
                });

                expect(_.isFunction(model.children.push)).is.true
            })

            it('value: array', function() {
                model.defineProperties({
                    children: {
                        value: []
                    }
                });

                expect(_.isFunction(model.children.push)).is.true
            })

            it('getter', function() {
                model.defineProperties({
                    firstName: 'Tom',
                    lastName: 'Dwan',
                    fullName: function() {
                        return this.firstName() + ' ' + this.lastName();
                    }
                });

                expect(ko.isObservable(model.fullName)).is.true;
                expect(model.fullName()).equal('Tom Dwan');
            })

            it('getter setter', function() {
                model.defineProperties({
                    firstName: 'Tom',
                    lastName: 'Dwan',
                    fullName: {
                        get: function() {
                            return this.firstName() + ' ' + this.lastName();
                        },

                        set: function(fullName) {
                            var arr = fullName.split(' ');
                            this.firstName(arr[0])
                            this.lastName(arr[1])
                        }
                    }
                });

                expect(ko.isObservable(model.fullName)).is.true;

                model.fullName('Phil Ivey');

                expect(model.firstName()).equal('Phil');
                expect(model.lastName()).equal('Ivey');

            })


            it('getter setter will NOT notify until someone subscribe it', function() {
                model.defineProperties({
                    firstName: 'Tom',
                    lastName: 'Dwan',
                    fullName: {
                        get: function() {
                            return this.firstName() + ' ' + this.lastName();
                        },

                        set: function(fullName) {
                            var arr = fullName.split(' ');
                            this.firstName(arr[0])
                            this.lastName(arr[1])
                        }
                    }
                });

                model.fullName.subscribe(spy);

                model.fullName('Bill John');

                expect(spy).have.not.been.calledWith('Bill John');

                model.fullName();

                expect(spy).have.been.calledWith('Bill John');
            })

            // it('should use proto value as default', function() {
            //     model.num = 1;

            //     model.defineProperties({
            //         num: {
            //             value: 0
            //         }
            //     })
            // })
            
        })

        describe('#getValues()', function() {
            beforeEach(function() {
                model.defineProperties({
                    firstName: 'Tom',
                    lastName: 'Dwan',
                    fullName: function() {
                        return this.firstName() + ' ' + this.lastName();
                    }
                });
            })


            describe('no include or exclude', function() {
                it('should return empty object', function() {
                    var model = new Model()
                    expect(model.getValues()).eql({})
                })

                it('should return observable which were defined', function() {  
                    expect(model.getValues()).eql({
                        firstName: 'Tom',
                        lastName: 'Dwan'
                    })
                })
            })

           
        })



        describe('#reset()', function() {


            beforeEach(function() {
                model = new ExtendModel();
            })

            it('should reset all properties', function() {   

                model.setValues({
                    firstName: 'Phil',
                    lastName: 'Ivey'
                });

                model.reset();

                expect(model.getValues()).eql({
                    firstName: 'Tom',
                    lastName: 'Dwan'
                });
            })
        });

        describe('#reset(property1, property2, propertyn)', function() {


            beforeEach(function() {
                model = new ExtendModel();
            })

            it('should reset specified properties', function() {
                


                model.setValues({
                    firstName: 'Phil',
                    lastName: 'Ivey'
                });

                model.reset('firstName');

                expect(model.getValues()).eql({
                    firstName: 'Tom',
                    lastName: 'Ivey'
                });
            })
        });
    });
});