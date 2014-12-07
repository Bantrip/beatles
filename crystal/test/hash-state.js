define(function(require) {
	var state = new (require('crystal/hash-state'));

	var $ = require('jquery');
	var ko = require('knockout');
	var spy = sinon.spy();
	var $win = $(window);

	describe('hash-state', function() {
		beforeEach(function(done) {
			location.hash = '';
			spy.reset();
			setTimeout(done, 1);
		})

		describe('#path(optPath)', function() {
			it('should set path to location', function(done) {
				var path = '/a/b/c';

				state.path(path);

				setTimeout(function() {
					

					expect(state.parse(location.hash).path).equal(path);					
					done();
				}, 1)
			})

			it('should set location to path', function(done) {
				var path = '/a/b/c';

				location.hash = state.stringify({
					path: path
				});

				setTimeout(function() {
					expect(state.path()).equal(path);
					done()
				}, 1);
			})
		})

		describe('#query(optQuery)', function() {
			it('should set query to location', function(done) {
				var query = {
					a: '1'
				};

				state.query(query);

				setTimeout(function() {
					expect(state.parse(location.hash).query).eql(query);
					done();
				}, 1)
			})

			it('should set location to query', function(done) {
				var query = {
					a: '1'
				};

				location.hash = state.stringify({
					query: query
				});

				setTimeout(function() {
					expect(state.query()).eql(query);
					done()
				}, 1);
			})
		})

		describe('#data(optData)', function() {
			it('should set data to location', function(done) {
				var data = {

					path: '/a/b',

					query: {
						a: '1'
					}
				};

				state.data(data);


				setTimeout(function() {
					expect(state.parse(location.hash)).eql(data);
					done();
				}, 1)
			})

			it('should set location to data', function(done) {
				var data = {

					path: '/a/b',

					query: {
						a: '1'
					}
				};

				location.hash = state.stringify(data);

				setTimeout(function() {
					expect(state.data()).eql(data);
					expect(state.path()).eql(data.path);
					expect(state.query()).eql(data.query);
					done();
				}, 1)
			})
		})

		// describe('#redirects', function() {
		// 	beforeEach(function() {
		// 		$win.unbind('hashchange')
		// 		$win.unbind('popstate');
		// 	})

		// 	it('should apply path', function(done) {
		// 		state = new (Hash.extend({
		// 			redirects: {
		// 				'': '/a/b'
		// 			}
		// 		}))

		// 		setTimeout(function() {
		// 			expect(state.parse(location.hash)).eql({
		// 				path: '/a/b',
		// 				query: undefined
		// 			});
		// 			done();
		// 		}, 1)
		// 	});

		// 	it('should apply data', function(done) {
		// 		state = new (Hash.extend({
		// 			redirects: {
		// 				'': {
		// 					path: '/a/b',
		// 					query: {
		// 						a: '1'
		// 					}
		// 				}
		// 			}
		// 		}))

		// 		setTimeout(function() {
		// 			expect(state.data()).eql({
		// 				path: '/a/b',
		// 				query: {
		// 					a: '1'
		// 				}
		// 			});
		// 			done();
		// 		}, 1)
		// 	});

		// 	it('should apply function', function(done) {
		// 		state = new (Hash.extend({
		// 			redirects: {
		// 				'': function(data) {
		// 					spy(data)
		// 					return {
		// 						path: '/a/b',
		// 						query: {
		// 							a: '1'
		// 						}
		// 					}
		// 				}
		// 			}
		// 		}))


		// 		setTimeout(function() {
		// 			expect(spy).have.been.calledWith({
		// 				path: '',
		// 				query: undefined
		// 			})

		// 			expect(state.parse(location.hash)).eql({
		// 				path: '/a/b',
		// 				query: {
		// 					a: '1'
		// 				}
		// 			});
		// 			done();
		// 		}, 1)
		// 	});



		// 	it('should apply multiple redirects', function(done) {
		// 		state = new (Hash.extend({
		// 			redirects: {
		// 				'': '/a',
		// 				'/a': '/a/b',
		// 				'/a/b': '/a/b/c'
		// 			}
		// 		}));

		// 		ko.computed(function() {
		// 			spy(state.path())
		// 		})

		// 		setTimeout(function() {
		// 			expect(state.parse(location.hash)).eql({
		// 				path: '/a/b/c',
		// 				query: undefined
		// 			});

		// 			expect(spy).have.been.calledOnce;
		// 			expect(spy).have.been.calledWith('/a/b/c');

		// 			done();
		// 		}, 1)
		// 	});

		// })

		
		describe('init', function() {
			it('should path query data be called once', function(done) {
				var spy = {
					path: sinon.spy(),
					query: sinon.spy(),
					data: sinon.spy()
				}

				ko.computed(function() {
					spy.path(state.path())
					spy.query(state.query())
					spy.data(state.data())
				})

				setTimeout(function() {
					expect(spy.path).have.been.calledWith('');
					expect(spy.query).have.been.calledWith({});
					expect(spy.data).have.been.calledWith({
						path: '',
						query: {}
					});

					expect(spy.path).have.been.calledOnce;
					expect(spy.query).have.been.calledOnce;
					expect(spy.data).have.been.calledOnce;
					done();
				}, 1)
			})

			// it('should path query data be called once even if with redirects', function(done) {
			// 	var spy = {
			// 		path: sinon.spy(),
			// 		query: sinon.spy(),
			// 		data: sinon.spy()
			// 	}

			// 	state = new (Hash.extend({
			// 		redirects: {
			// 			'': '/a',
			// 			'/a': '/a/b',
			// 			'/a/b': {
			// 				path: '/a/b/c',
			// 				query: {
			// 					a: '1'
			// 				}
			// 			}
			// 		}
			// 	}));

			// 	ko.computed(function() {
			// 		spy.path(state.path())
			// 		spy.query(state.query())
			// 		spy.data(state.data())
			// 	})

			// 	setTimeout(function() {
			// 		expect(spy.path).have.been.calledWith('/a/b/c');
			// 		expect(spy.query).have.been.calledWith({
			// 			a: '1'
			// 		});

			// 		expect(spy.data).have.been.calledWith({
			// 			path: '/a/b/c',
			// 			query: {
			// 				a: '1'
			// 			}
			// 		});
				

			// 		expect(spy.path).have.been.calledOnce;
			// 		expect(spy.query).have.been.calledOnce;
			// 		expect(spy.data).have.been.calledOnce;
			// 		done();
			// 	}, 1)
			// })


		})


		// describe('#isBack()', function() {
		// 	it('this test must be grep individual to prevent disturbed from other tests. should correct', function(done) {
		// 		var state1 = new Hash();

		// 		location.hash = '#/d/c';

		// 		ko.computed(function() {
		// 			state1.path();
		// 			spy(state1.isBack())
		// 			console.log(state1.path(), state.isBack())
		// 		})

		// 		window.history.back();

		// 		setTimeout(function() {		
		// 			console.log(spy.args)
		// 			expect(spy.args[0][0]).is.false
		// 			expect(spy.args[spy.args.length - 1][0]).is.true
		// 			done();
		// 		}, 600)
		// 	})
		// });

	});
})