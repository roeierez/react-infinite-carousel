
module.exports = {
    applyTranslateStyle: function(currentStyle, x, y, z){
        currentStyle['Transform'] = 'translate3d(' + x + 'px,' + y + 'px,' + z + 'px)';
        currentStyle['WebkitTransform'] = 'translate3d(' + x + 'px,' + y + 'px,' + z + 'px)';
        return currentStyle;
    }
}

