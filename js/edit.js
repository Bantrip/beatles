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
            var tpl = '<div class="item">\
                    <div class="con clearfix">\
                        <div class="upload"><input type="text" id="' + UPLOAD_IMG_ID + id + '" /></div>\
                        <span class="glyphicon glyphicon-remove" style="cursor: pointer"></span>\
                    </div>\
                    <div class="J_img-list"></div>\
                </div>';
            return tpl;
        },

        selectedLocTpl = function(cityList) {
            var tpl = '';
            cityList.forEach(function(item) {
                tpl += ('<li><span class="name" data-cityid="' + item.cityId + '">' + item.cityName + '</span><span class="glyphicon glyphicon-remove"></span></li>');
            });
            return tpl;
        },

        tagRtTpl = function(data) {
            var tpl = '';

            data.forEach(function(item, index) {
                tpl += ('<p>' + item.group + '：<span class="name" data-tagid="' + item.tagId + '">' + item.tag + '</span></p>');
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
                    uploader: '/ajax/uploadImg',
                    width: 120,
                    onUploadSuccess: function(file, data, res) {
                        var wrap = $('#' + this.movieName).parents('.con').next('.J_img-list');
                        console.log(wrap)
                        data = JSON.parse(data)
                        if(data.code == 200) {
                            wrap.append('<img style="margin-top: 10px;" src=' + data.msg.url + '>')
                        } else {
                            alert(data.msg);
                        }
                    }
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
                width: 120,
                onUploadSuccess: function(file, data, res) {
                    data = JSON.parse(data)
                    if(data.code == 200) {
                        $('.J_product-img-list').append('<img style="margin-top: 10px;" src=' + data.msg.url + '>')
                    } else {
                        alert(data.msg);
                    }
                }
            });
        },

        initSelectTag = function() {
            var tagGroup = $('.J_tag-group'),
                tagGroups = tagGroup.find('li'),
                tagCon = $('.J_tag-con'),
                tagCons = tagCon.find('.tab-pane'),
                tagRtCon = $('.J_tag'),
                tagArr = [],

                setCatStatus = function(index) {
                    tagGroups.eq(index).find('.glyphicon-ok').removeClass('Hide');
                };

            $('.J_btn-edit-tag').on('click', function() {
                var tagIdList = tagRtCon.find('.tag').map(function(i, item) {
                    return $(item).attr('data-tagid');
                }).get();

                $('#modalTag').modal();
                tagCon.find('.input-tag').each(function(i, item) {
                    var self = $(item);
                    if(tagIdList.indexOf(self.attr('data-tagid')) > -1) {
                        self.attr('checked', 'checked');
                    }
                });

                tagCons.each(function(index) {
                    var self = $(this),
                        tag = $(this).find('.input-tag:checked');
                    if(tag.length > 0) {
                        setCatStatus(self.index());
                    }
                });

            });

            tagCon.on('change', '.input-tag', function() {
                var self = $(this),
                    container = self.parents('.tab-pane'),
                    index = container.index();

                setCatStatus(index);

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

            var locWrap = $('.J_loc'),
                list = $('.J_list-loc'),
                selectedList = $('.J_list-selected-loc');

            $('.J_btn-edit-loc').on('click', function() {

                var cityList = locWrap.find('dd span').map(function(i, item) {
                        var self = $(item);
                        return {
                            cityId: self.attr('data-cityid'),
                            cityName: self.text()
                        };
                    }).get(),
                    cityIdList = cityList.map(function(item) {
                        return item.cityId;
                    });

                $('#modalLocation').modal();
                list.find('a').each(function(i, item) {
                    var self = $(this);
                    if(cityIdList.indexOf(self.attr('data-cityid')) > -1) {
                        self.addClass('disable');
                    }
                });

                selectedList.html(selectedLocTpl(cityList));
            });
        
            $('input[name=searchType]').on('change', function() {
                searchLocation();
            });

            $('.J_input-search').on('keyup', function() {
                searchLocation();
            });

            list.on('click', 'a', function() {
                var self = $(this),
                    cityId = self.attr('data-cityid'),
                    cityName = self.text();

                if(self.hasClass('disable')) {
                    return;
                }

                selectedList.append(selectedLocTpl([{
                    cityId: cityId,
                    cityName: cityName
                }]));
                self.addClass('disable');
            });

            selectedList.on('click', '.glyphicon-remove', function() {
                var item = $(this).parent(),
                    loc = item.find('.name'),
                    cityId = loc.attr('data-cityid');

                list.find('a').each(function(i, item) {
                    var self = $(this);
                    if(self.attr('data-cityid') == cityId) {
                        self.removeClass('disable');
                    }
                });
                item.remove();

            });

            $('.J_submit-loc').on('click', function() {
                selectedList.find('.name').each(function(i, item) {
                    var self = $(item),
                        cityId = self.attr('data-cityid'),
                        cityName = self.text();
                        locWrap.find('dd').html('<span data-cityid="' + cityId + '">' + cityName + '</span>');
                });
                locWrap.removeClass('Hide');
            });
        },

        getValue = function(item) {
            return (item.val() + '').trim();
        },

        checkedFormData = function(data) {
            var checked = true;

            for(var i in data) {
                var dataI = data[i];
                if((typeof dataI == 'string' && dataI == '') || ($.isArray(dataI) && dataI.length == 0)) {
                    checked = false;
                    break;
                }
            }

            return checked;
        },

        initSubmit = function() {
            $('.J_submit').on('click', function() {
                var data = {};
                    
                data.name = getValue($('.J_name'));
                data.imgList = [];
                data.detail = [];
                data.price = getValue($('.J_price'));
                data.reason = getValue($('.J_rcmd-reason'))
                data.tagList = [];
                data.locList = [];
                data.buyUrl = getValue($('.J_buy-url'));

                $('.J_product-img-list img').map(function(i, item) {
                    data.imgList.push(item.src);
                });

                $('.J_detail .item').each(function(i, item) {
                    var self = $(item),
                        textarea = self.find('textarea');
                    if(textarea.length > 0) {
                        var value = getValue(textarea);
                        if(value != '') {
                            data.detail.push(value);
                        }
                    } else {
                        self.find('.J_img-list img').each(function(i, item) {
                            data.detail.push(item.src);
                        });
                    }

                });

                $('.J_tag .name').map(function(i, item) {console.log()
                    data.tagList.push($(item).attr('data-tagid'));
                });

                $('.J_loc dd span').map(function(i, item) {
                    data.locList.push($(item).attr('data-cityid'));
                });

                if(!checkedFormData(data)) {
                    alert('请把信息填写完整！');
                    return;
                }

                $.ajax({
                    url: '/ajax/submitInfo',
                    data: data,
                    type: 'post',
                    success: function(r) {
                        if(r.code == 200) {
                            alert('提交成功！');
                            window.location = '/list.html';
                        } else {
                            alert(r.msg);
                        }
                    }
                });

            });
        };

    initAddDetal();
    initPrice();
    initUpload();
    initSelectTag();
    initSelectLocation();
    initSubmit();

});