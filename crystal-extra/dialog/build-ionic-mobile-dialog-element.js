define(function(require) {
    var ko = require('knockout');

    return function(element) {    
        var classList = element.classList;    

        return {
            show: function() {
                element.style.display = 'block';
                classList.add('active');
                // classList.add('slide-in-up');
                setTimeout(function() {
                    element.style.height = document.body.offsetHeight + 'px';
                });
            },

            hide: function() {
                element.style.display = 'none';
                classList.remove('active');
                // classList.remove('slide-in-up');
            }
        }

    }

})