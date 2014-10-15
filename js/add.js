define(function(require, exports) {
    var detail = $('.J_detail'),
        UPLOAD_IMG_ID = 'uploadDesImg',

        detailTextTpl = function() {
            var tpl = '<div class="item">\
                    <textarea class="form-control detail-text" cols="30" rows="3" style="display: inline-block; width: 80%; margin-top: 5px; vertical-align: top;"></textarea>\
                    <span class="glyphicon glyphicon-remove" style="cursor: pointer"></span>\
                </div>';
            return tpl;
        },

        detailImgTpl = function(id) {
            var tpl = '<div class="item clearfix">\
                    <div class="upload"><input type="text" id="' + UPLOAD_IMG_ID + id + '" /></div>\
                    <span class="glyphicon glyphicon-remove" style="cursor: pointer"></span>\
                </div>';
            return tpl;
        },

        tagRtTpl = function(data) {
            var tpl = '';

            data.forEach(function(item, index) {
                tpl += ('<dd>' + item.group + '：<span class="name" data-tagid="' + item.tagId + '">' + item.tag + '</span></dd>');
            });

            return tpl;
        },

        locationListTpl = function(data) {
            var tpl = '',
                selectedList = $('.J_list-selected-loc .name'),
                cityIdArr = [];

            selectedList.each(function() {
                cityIdArr.push(parseInt($(this).attr('data-cityid')));
            });

            data.forEach(function(item, index) {
                var selected = (cityIdArr.indexOf(item.cityId) > -1);
                tpl += ('<li><a href="javascript:;" data-cityid="' + item.cityId + '" class="' + (selected ? 'disable' : '') + '">' + item.cityName + '</a></li>');
            });

            return tpl;
        },

        initAddDetal = function() {
            var imgId = 0;
            $('.J_add-text').on('click', function() {
                detail.append(detailTextTpl());
            });

            $('.J_add-img').on('click', function() {
                detail.append(detailImgTpl(imgId));

                $("#" + UPLOAD_IMG_ID + imgId).uploadify({
                    buttonText: '上传',
                    height: 30,
                    swf: '/uploadify/uploadify.swf',
                    uploader: '/uploadify/uploadify.php',
                    width: 120
                });

                imgId++;
            });

            $('.J_detail').on('click', '.glyphicon-remove', function() {
                $(this).parents('.item').remove();
            });
        },

        initPrice = function() {
            $('.J_price').on('keyup', function() {
                this.value = this.value.replace(/\D/g, '');
            });
        },

        initUpload = function() {
            $("#uploadProductImg").uploadify({
                buttonText: '上传',
                height: 30,
                swf: '/uploadify/uploadify.swf',
                uploader: '/ajax/uploadImg',
                width: 120
            });
        },

        initSelectTag = function() {
            var tagGroup = $('.J_tag-group'),
                tagGroups = tagGroup.find('li'),
                tagCon = $('.J_tag-con'),
                tagCons = tagCon.find('.tab-pane'),
                tagRtCon = $('.J_tag'),
                tagArr = [];

            tagCon.on('change', '.input-tag', function() {
                var self = $(this),
                    container = self.parents('.tab-pane'),
                    index = container.index();

                tagGroups.eq(index).find('.glyphicon-ok').removeClass('Hide');

            });

            $('.J_submit-tag').on('click', function() {
                tagCons.each(function(index) {
                    var tag = $(this).find('.input-tag:checked');
                    if(tag.length > 0) {
                        tagArr.push({
                            group: tagGroups.eq(index).find('.name').text(),
                            tagId: tag.attr('data-tagid'),
                            tag: tag.parent().text().trim()
                        });
                    }
                });

                if(tagArr.length > 0) {
                    var html = tagRtTpl(tagArr);
                    tagRtCon.removeClass('Hide').find('dd').html(html);
                }
            });
        },

        searchLocation = function() {
            var list = $('.J_list-loc');

            $.ajax({
                url: '/ajax/searchlocation',
                data: {
                    keyword: $('.J_input-search').val(),
                    type: $('input[name=searchType]:checked').attr('data-type')
                },
                success: function(rt) {
                    if(rt.code == 200) {
                        list.html(locationListTpl(rt.msg.list));
                    }
                }
            });
        },

        initSelectLocation = function() {
        
            $('input[name=searchType]').on('change', function() {
                searchLocation();
            });

            $('.J_input-search').on('keyup', function() {
                searchLocation();
            });

            
        };

    initAddDetal();
    initPrice();
    initUpload();
    initSelectTag();
    initSelectLocation();

});