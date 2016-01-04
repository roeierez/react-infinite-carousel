(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["Carousel"] = factory(require("react"));
	else
		root["Carousel"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(1),
	    HorizontalScroller = __webpack_require__(2),
	    StyleHelper = __webpack_require__(3),
	    DEFAULT_ITEMS_TO_RENDER_COUNT = 2;

	var carousel = React.createClass({displayName: "carousel",

	    getInitialState: function () {
	        return {
	            centeredItemIndex: 0,
	            centerItemProgress: 0.5
	        };
	    },

	    componentDidMount: function(){
	        this.parentElementWidth = React.findDOMNode(this).parentElement.clientWidth;
	        window.addEventListener('resize', this.onResize);
	        this.refs.scroller.scroll( (this.getItemWidth() + this.getItemsSpacing()) * (this.props.initialItemIndex || this.props.controlledItemIndex || 0) );
	        this.forceUpdate();
	    },

	    componentWillReceiveProps: function(newProps, newState) {
	        if (newProps.controlledItemIndex && newProps.controlledItemIndex !== this.props.controlledItemIndex) {
	            this.refs.scroller.scroll( (this.getItemWidth() + this.getItemsSpacing()) * (newProps.controlledItemIndex || 0) );
	        }
	    },

	    componentWillUnmount: function(){
	        window.removeEventListener('resize', this.onResize);
	    },

	    onResize: function(){
	        this.parentElementWidth = React.findDOMNode(this).parentElement.clientWidth;
	        this.forceUpdate();
	    },

	    getContainerWidth: function(){
	        return this.props.width || this.parentElementWidth;
	    },

	    getItemWidth: function(){
	        return this.props.itemWidth || this.getContainerWidth() / 2 || 0;
	    },

	    getItemsPerSide: function(){
	        return this.props.numberOfRenderItemsPerSide || DEFAULT_ITEMS_TO_RENDER_COUNT;
	    },

	    getScrollerSize: function(){
	        return (this.props.itemsCount - 1) * (this.getItemWidth() + this.getItemsSpacing());
	    },

	    getItemsSpacing: function(){
	        return this.props.spacing || this.getItemWidth() / 6 || 0;
	    },

	    onScroll: function (offset) {
	        var itemsSpacing = this.getItemsSpacing(),
	            distanceBetweenItems = this.getItemWidth() + itemsSpacing,
	            centeredItem = Math.max(0, Math.min(this.props.itemsCount - 1,  this.getCenterLeavingItem(offset, distanceBetweenItems) )),
	            containerStartOffset = centeredItem * distanceBetweenItems - this.getContainerWidth() / 2 - this.getItemWidth() / 2,
	            relativeProgress = (offset - containerStartOffset) / (this.getContainerWidth() + this.getItemWidth());

	        this.setState({
	            centeredItemIndex: centeredItem,
	            centerItemProgress: relativeProgress
	        });
	    },

	    getCenterLeavingItem: function (offset, distanceBetweenItems) {
	        var centerLeavingItem = this.state.centeredItemIndex,
	            floorIndex = Math.floor(offset / distanceBetweenItems),
	            ceilIndex = Math.ceil(offset / distanceBetweenItems);

	        if (floorIndex >= this.state.centeredItemIndex) {
	            centerLeavingItem = floorIndex;
	        } else {
	            centerLeavingItem = ceilIndex;
	        }

	        return centerLeavingItem;
	    },

	    renderItem: function(index){
	        var containerWidth = this.getContainerWidth(),
	            scrollingRight = this.state.centerItemProgress > 0.5,
	            itemWidth = this.getItemWidth(),
	            itemProgress = this.getItemProgress(index),
	            itemTranslate = itemProgress * (containerWidth + itemWidth) - itemWidth,
	            itemStyle = StyleHelper.applyTranslateStyle({
	                width: this.getItemWidth(),
	                height: '100%',
	                position: 'absolute',
	                top: '0px',
	                left: '0px'
	            }, itemTranslate, 0, 0);

	        return (
	            React.createElement("div", {key: "carouselItem" + (index % (2 * this.getItemsPerSide() + 1 )), style: itemStyle}, 
	                this.props.itemRenderer(index, itemProgress)
	            )
	        );
	    },

	    getItemProgress: function(index){
	        var shiftFromCenter = index - this.state.centeredItemIndex,
	            containerWidth = this.getContainerWidth(),
	            itemsSpacing = this.getItemsSpacing(),
	            itemWidth = this.getItemWidth(),
	            centerItemTranslateX = (containerWidth - (this.state.centerItemProgress * (containerWidth + itemWidth))) || 0,
	            currentItemTranslate  = centerItemTranslateX + shiftFromCenter * itemsSpacing + shiftFromCenter * itemWidth;

	            return (currentItemTranslate + itemWidth) / (containerWidth + itemWidth);
	    },

	    render: function () {
	        return (

	                React.createElement("div", {style: {width: this.getContainerWidth(), height: '100%', overflow: 'hidden', position: 'relative'}}, 
	                    this.renderBackground(), 
	                    React.createElement(HorizontalScroller, {ref: "scroller", size: this.getScrollerSize(), snap: this.getItemWidth() + this.getItemsSpacing(), onScroll: this.onScroll}, 
	                        React.createElement("div", {style: {position: 'absolute', height: '100%', width: '100%', top: 0, left: 0}}, 
	                            this.renderItems()
	                        )
	                    )
	                )

	        )
	    },

	    renderItems: function(){
	        var itemsToRender = [this.renderItem(this.state.centeredItemIndex)];
	        for (var i = 1; i <= this.getItemsPerSide(); ++i) {
	            if (this.state.centeredItemIndex - i >= 0) {
	                itemsToRender.unshift(this.renderItem(this.state.centeredItemIndex - i));
	            }

	            if (this.state.centeredItemIndex + i < this.props.itemsCount) {
	                itemsToRender.push(this.renderItem(this.state.centeredItemIndex + i));
	            }
	        }

	        return itemsToRender;
	    },

	    renderBackground: function(){
	        var scrollingRight = this.state.centerItemProgress > 0.5,
	            nextItem = this.state.centeredItemIndex,
	            containerWidth = this.getContainerWidth(),
	            itemWidth = this.getItemWidth();

	        if (this.state.centerItemProgress != 0.5) {
	            if (scrollingRight && this.props.itemsCount > this.state.centeredItemIndex + 1) {
	                nextItem++;
	            } else if (!scrollingRight && nextItem > 0) {
	                nextItem--;
	            }
	        }
	        var absoluteProgress = Math.abs(this.getItemProgress(this.state.centeredItemIndex) - 0.5) * (containerWidth + itemWidth);
	        return this.props.backgroundRenderer(this.state.centeredItemIndex, nextItem, absoluteProgress / itemWidth);
	    }
	});

	carousel.propTypes = {
	    backgroundRenderer: React.PropTypes.func,
	    itemRenderer: React.PropTypes.func,
	    itemWidth: React.PropTypes.number,
	    width: React.PropTypes.number,
	    spacing: React.PropTypes.number,
	    numberOfRenderItemsPerSide: React.PropTypes.number,
	    itemsCount: React.PropTypes.number,
	    initialItemIndex: React.PropTypes.number,
	    controlledItemIndex: React.PropTypes.number
	};

	module.exports = carousel;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(1),
	    SCROLLING_TIME_CONSTANT =   250;

	var HorizontalScroller = React.createClass ({displayName: "HorizontalScroller",

	    timestamp: 0,
	    frame: 0,
	    velocity:0,
	    amplitude: 0,
	    pressed: 0,
	    ticker: 0,
	    reference: 0,
	    offset: 0,
	    target: 0,

	    render: function() {
	        //return React.Children.only(this.props.children);
	        return React.createElement("div", {
	                    onTouchStart: this.tap, 
	                    onTouchMove: this.drag, 
	                    onTouchEnd: this.release, 
	                    onMouseDown: this.tap, 
	                    onMouseMove: this.drag, 
	                    onMouseUp: this.release, 
	                    style: {height: '100%', width: '100%'}}, React.Children.only(this.props.children)
	            );
	    },

	    xpos: function(e) {
	        // touch event
	        if (e.targetTouches && (e.targetTouches.length >= 1)) {
	            return e.targetTouches[0].clientX;
	        }

	        // mouse event
	        return e.clientX;
	    },

	    scroll: function(x){
	        this.offset = x;
	        this.props.onScroll(x);
	    },

	    autoScroll: function() {
	        var elapsed, delta;

	        if (this.amplitude) {
	            elapsed = Date.now() - this.timestamp;
	            delta = this.amplitude * Math.exp(-elapsed / SCROLLING_TIME_CONSTANT);
	            if (delta > 3 || delta < -3) {
	                this.scroll(this.target - delta);
	                requestAnimationFrame(this.autoScroll);
	            } else {
	                this.scroll(this.target);
	            }
	        }
	    },

	    tap: function (e) {
	        this.pressed = true;
	        this.reference = this.xpos(e);

	        this.velocity = this.amplitude = 0;
	        this.frame = this.offset;
	        this.timestamp = Date.now();

	        e.preventDefault();
	        e.stopPropagation();
	    },

	    drag: function(e) {
	        var x, delta, me = this;
	        if (this.pressed) {
	            x = this.xpos(e);
	            delta = this.reference - x;
	            if (delta > 2 || delta < -2) {
	                this.reference = x;
	                this.velocity = delta;
	                clearTimeout(this.timeoutID);
	                this.timeoutID = setTimeout(function(){
	                    me.velocity = 0;
	                },100);
	                this.scroll(this.offset + delta);
	            }
	        }
	        e.preventDefault();
	        e.stopPropagation();
	    },

	    release: function(e) {
	        var snap = this.props.snap;
	        this.pressed = false;
	        clearInterval(this.ticker);

	        this.amplitude = this.velocity;
	        this.target = this.offset;
	        if (this.amplitude != 0) {
	            if (this.amplitude > 0) {
	                this.target   = Math.ceil(this.offset / snap) * snap;
	            } else {
	                this.target   = Math.floor(this.offset / snap) * snap;
	            }
	        }

	        this.target = Math.round(this.target / snap) * snap;

	        if (typeof this.props.size == 'number') {
	            this.target = Math.max(0, Math.min(this.props.size, Math.round(this.target / snap) * snap));
	        }

	        this.amplitude = this.target - this.offset;
	        this.timestamp = Date.now();
	        requestAnimationFrame(this.autoScroll);

	        e.preventDefault();
	        e.stopPropagation();
	    }
	});

	HorizontalScroller.propTypes = {
	    onScroll: React.PropTypes.func,
	    snap: React.PropTypes.number,
	    size: React.PropTypes.number
	}

	module.exports = HorizontalScroller;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	
	module.exports = {
	    applyTranslateStyle: function(currentStyle, x, y, z){
	        var styleValue = 'translate3d(' + x.toString() + 'px,' + y + 'px,' + z + 'px)';
	        currentStyle['Transform'] = styleValue;
	        currentStyle['WebkitTransform'] = styleValue;
	        currentStyle['msTransform'] = styleValue;
	        currentStyle['MozTransform'] = styleValue;
	        return currentStyle;
	    }
	}



/***/ }
/******/ ])
});
