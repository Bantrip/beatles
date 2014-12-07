define(function() {
    var div = document.createElement('div');

    // 键盘输入的空格和&nbsp;形成的空格是不同的，
    // 所以要把keySpace替换成nbspSpace，才能形成空格！！！！
    var nbspSpace = String.fromCharCode(160);
    var keySpace = String.fromCharCode(32);

    var keySpaceReg = new RegExp(keySpace, 'g');

    var TEXT = (function() {
        div.innerHTML = 'a';
        return div.innerText === 'a' ? 'innerText' : 'textContent';
    })();


    // 换行ff 转换\n的时候不会自动换成<br>, 反之亦然
    // http://stackoverflow.com/questions/10490851/multiline-text-is-displayed-as-a-single-line-in-firefox-using-knockoutjs-binding
    var needConvertLineBreak = (function() {
        div.innerHTML = 'a<br>a';
        return div[TEXT] === 'aa' ? true : false;
    })();

    var htmlFromText = function(s) {
        div[TEXT] = s.replace(keySpaceReg, nbspSpace);
        return div.innerHTML;
    };

    var textFromHtml = function(s) {   
        div.innerHTML = s;   
        return div[TEXT];
    };

    return {
        htmlFromText: needConvertLineBreak ? function(s) {
            return htmlFromText(s).replace(/\n/g, '<br>');
        } : htmlFromText,

        textFromHtml: needConvertLineBreak ? function(s) {
            return textFromHtml(s.replace(/<br>/g, '\n'));
        } : textFromHtml
    }
});

