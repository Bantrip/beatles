define(function(require) {
    var $ = require('jquery');
    var ko = require('knockout');
    require('jquery.file.upload');
    var _ = require('lodash');

    var defaultOptions = {
        paramName: 'file',

        // required
        url: null,

        dataType: 'json',

        add: function (e, data) {
            var self = $(this),
                uploadFile = data.files[0],
                width = self.fileupload('option', 'width'),
                height = self.fileupload('option', 'height'),
                imageOnly = self.fileupload('option', 'imageOnly'),
                apiURL = (window.createObjectURL && window) 
                    || (window.URL && URL.revokeObjectURL && URL) 
                    || (window.webkitURL && webkitURL),
                    url = apiURL.createObjectURL(data.files[0]),

                getImageSize = function(data, callback) {
                    var image = new Image();

                    function onload() {
                        callback({
                            height: image.height || 1000,
                            width: image.width || 1000
                        });
                        image.onload = null;
                        clearInterval(handler);
                        clearTimeout(timeout);
                    }

                    image.onload = onload;
                    var handler = setInterval(function() {
                        if (image.width && image.height) {
                            onload();
                        }
                    }, 50);

                    var timeout = setTimeout(function() {
                        onload();
                    }, 1000);

                    image.src = data;
                };   

            if (imageOnly) {
                if (!(/\.(gif|jpg|jpeg|tiff|png)$/i).test(uploadFile.name)) {
                    var callback = $(this).fileupload('option', 'callback');
                    callback('必须上传图片');
                    return;
                }
            }

            if(width || height) {
                getImageSize(url, function(size) {
                    if (width && size.width != width || height && size.height != height) {
                        alert('请上传符合尺寸的图片！');
                    } else {
                        data.process().done(function () {
                            data.submit();
                        });
                    }
                });
            } else {
                data.process().done(function () {
                    data.submit();
                });
            }

            
        },

        change: function(e, data) {
            // var context = $(this).fileupload('option', 'context');
            // context.uploadedFiles(0);
            // context.totalFiles(data.files.length);
        },

        formData: function() {
            var file = this.files[0];
            return [{
                name: 'name',
                value: file.name
            }]
        },
        
        done: function(e, data) {
            var result = data.result;

            if (result.code !== 200) {
                data.callback(result.msg);
            } else {
                data.callback(null, result.msg || result);
            }                
        },

        fail: function(e, data) {
            data.callback('上传失败: ' + data.errorThrown);
        },

        // progress: function(e, data) {
        //     data.context.percent(data.loaded / data.total);
        // }
    }

    return {
        init: function(element, valueAccessor) {

            var options = _.extend({}, defaultOptions, valueAccessor());

            var $element = $(element);

            if (options.dropPasteZoneSelector) {
                options.dropZone = options.pasteZone = $element.closest(options.dropPasteZoneSelector);
            } else {
                options.dropZone = options.pasteZone = null;
            }

            $element.fileupload(options);
        }
    }

});