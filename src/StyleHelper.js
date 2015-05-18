
var transformKey = 'transform';
['webkit', 'Moz', 'O', 'ms'].every(function (prefix) {
    var e = prefix + 'Transform';
    if (typeof document.body.style[e] !== 'undefined') {
        transformKey = e;
        return false;
    }
    return true;
});

transformKey = '-webkit-transform';
module.exports = {
    applyTranslateStyle: function(currentStyle, x, y, z){
        currentStyle[transformKey] = 'translate3d(' + x + 'px,' + y + 'px,' + z + 'px)';
        return currentStyle;
    }
}

