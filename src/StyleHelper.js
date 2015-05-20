
module.exports = {
    applyTranslateStyle: function(currentStyle, x, y, z){
        var styleValue = 'translate3d(' + x.toString() + 'px,' + y + 'px,' + z + 'px)';
        currentStyle['Transform'] = styleValue;
        currentStyle['WebkitTransform'] = styleValue;
        currentStyle['MsTransform'] = styleValue;
        currentStyle['MozTransform'] = styleValue;
        return currentStyle;
    }
}

