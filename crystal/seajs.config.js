(function() {

	seajs.config({
		alias: {
			_: 'vendor-wrap-with-define/dist/lodash',
			history: 'vendor-wrap-with-define/dist/history-html5',
			path: 'vendor-wrap-with-define/dist/path',
			$: 'vendor-wrap-with-define/dist/jquery',
			noty: 'vendor-wrap-with-define/dist/noty',
			bootstrapJS: 'vendor-wrap-with-define/dist/bootstrap3',
			bootstrapCSS: 'vendor-wrap-with-define/asset/bootstrap3/css/bootstrap.css',
			bootstrapThemeCSS: 'vendor-wrap-with-define/asset/bootstrap3/css/bootstrap-theme.css',
			ko: 'vendor-wrap-with-define/dist/knockout',
			step: 'vendor-wrap-with-define/dist/step',
		},

		paths: {
			crystal: 'lib'
		}
	});

})()