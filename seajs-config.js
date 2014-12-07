(function() {
	seajs.config({
		alias: {
			lodash: 'vendor-wrap-with-define/dist/lodash',
			path: 'vendor-wrap-with-define/dist/path',
			jquery: 'vendor-wrap-with-define/dist/jquery',
			noty: 'vendor-wrap-with-define/dist/noty',
			knockout: 'vendor-wrap-with-define/dist/knockout',
            // async: 'vendor-wrap-with-define/dist/async',
			moment: 'vendor-wrap-with-define/dist/moment',
            autosize: 'vendor-wrap-with-define/dist/autosize',
            chart: 'vendor-wrap-with-define/dist/chart',

            'jquery.ui.widget': 'vendor/jquery-ui/widget',
            'jquery.file.upload': 'vendor/jquery-file-upload/index',

			'bootstrap2': 'vendor-wrap-with-define/dist/bootstrap2',
			// css 一定要加.css 因为编译的时候需要额外处理
			'bootstrap2.css': 'vendor-wrap-with-define/asset/bootstrap2/css/bootstrap.css',

			'bootstrap3': 'vendor-wrap-with-define/dist/bootstrap3',
			'bootstrap3.css': 'vendor-wrap-with-define/asset/bootstrap3/css/bootstrap.css',
			'bootstrap3Theme.css': 'vendor-wrap-with-define/asset/bootstrap3/css/bootstrap-theme.css'
		}
	});

})()