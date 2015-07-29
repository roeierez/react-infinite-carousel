var React = require('react'),
    HorizontalScroller = require('./HorizontalScroller.js'),
    StyleHelper = require('./StyleHelper.js'),
    DEFAULT_ITEMS_TO_RENDER_COUNT = 2;

var carousel = React.createClass({

    getInitialState: function () {
        return {
            centeredItemIndex: 0,
            centerItemProgress: 0.5
        };
    },

    componentDidMount: function(){
        this.parentElementWidth = React.findDOMNode(this).clientWidth;
        window.addEventListener('resize', this.onResize.bind(this));
        this.forceUpdate();
    },

    componentWillUnmount: function(){
        window.removeEventListener('resize', this.onResize.bind(this));
    },

    onResize: function(){
        this.parentElementWidth = React.findDOMNode(this).clientWidth;
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

    renderCarouselItem: function (index, translateX, progress) {
        var itemStyle = StyleHelper.applyTranslateStyle({
                justifyContent: 'center',
                display: 'flex',
                flexDirection: 'column',
                width: this.getItemWidth(),
                height: '100%',
                position: 'absolute',
                top: '0px',
                left: '0px'
            }, translateX, 0, 0);

        return (
            <div key={"carouselItem" + (index % (2 * this.getItemsPerSide() + 1 ))} style={itemStyle}>
                {this.props.itemRenderer(index, progress)}
            </div>
        );
    },

    renderBackgroundItem: function (index, translateX, givenOpacity) {
        var itemWidth = this.getItemWidth(),
            itemsSpacing = this.getItemsSpacing(),
            containerWidth = this.getContainerWidth(),
            distanceFromCenter1 = Math.abs(translateX - containerWidth / 2 + itemWidth / 2),
            opacity = givenOpacity ? givenOpacity : 1 - distanceFromCenter1 / (itemWidth / 2 + itemsSpacing),
            backgroundStyle = StyleHelper.applyTranslateStyle({
                opacity: opacity,
                width: containerWidth,
                height: '100%',
                position: 'absolute',
                top: '0px',
                left: '0px'
            }, 0,0,0);

        return (
            <div key={"background" + index} style={backgroundStyle}>
                {this.props.backgroundRenderer(index)}
            </div>
        );
    },

    render: function () {
        var itemWidth = this.getItemWidth(),
            containerWidth = this.getContainerWidth(),
            itemsSpacing = this.getItemsSpacing(),
            scrollingRight = this.state.centerItemProgress > 0.5,

            centerItemTranslateX = (containerWidth - (this.state.centerItemProgress * (containerWidth + itemWidth))) || 0,
            itemsToRender = [this.renderCarouselItem(this.state.centeredItemIndex, centerItemTranslateX)];

        for (var i = 1; i <= this.getItemsPerSide(); ++i) {
            var currentItemProgress = 0,
                currentItemTranslate = 0;

            if (this.state.centeredItemIndex - i >= 0) {
                currentItemTranslate  = centerItemTranslateX - i * itemsSpacing - i * itemWidth;
                currentItemProgress = (currentItemTranslate + itemWidth) / (containerWidth + itemWidth);
                itemsToRender.unshift(this.renderCarouselItem(this.state.centeredItemIndex - i, currentItemTranslate, currentItemProgress));
            }

            if (this.state.centeredItemIndex + i < this.props.itemsCount) {
                currentItemTranslate  = centerItemTranslateX + i * itemsSpacing + i * itemWidth;
                currentItemProgress = (currentItemTranslate + itemWidth) / (containerWidth + itemWidth);
                itemsToRender.push(this.renderCarouselItem(this.state.centeredItemIndex + i, currentItemTranslate, currentItemProgress));
                if (i == 1 && scrollingRight) {

                }
            }
        }

        var scrolledOutItemBackground = this.renderBackgroundItem(this.state.centeredItemIndex, centerItemTranslateX, 1),
            scrolledInItemBackground = scrolledOutItemBackground;

        if (scrollingRight) {
            if (this.state.centeredItemIndex < this.props.itemsCount - 1) {
                scrolledInItemBackground = this.renderBackgroundItem(this.state.centeredItemIndex + 1, centerItemTranslateX + itemsSpacing + itemWidth);
            }
        } else if (this.state.centeredItemIndex > 0 ) {
            scrolledInItemBackground = this.renderBackgroundItem(this.state.centeredItemIndex - 1, centerItemTranslateX - itemsSpacing - itemWidth);
        }


        return (
            <HorizontalScroller size={this.getScrollerSize()} snap={itemWidth + itemsSpacing} onScroll={this.onScroll}>
                <div style={{width: containerWidth, height: '100%', overflow: 'hidden', position: 'relative'}}>
                    {scrolledOutItemBackground}
                    {scrolledInItemBackground}
                    {itemsToRender}
                </div>
            </HorizontalScroller>
        )
    }
});

carousel.propTypes = {
    backgroundRenderer: React.PropTypes.func,
    itemRenderer: React.PropTypes.func,
    itemWidth: React.PropTypes.number,
    width: React.PropTypes.number,
    spacing: React.PropTypes.number,
    numberOfRenderItemsPerSide: React.PropTypes.number,
    itemsCount: React.PropTypes.number
};

module.exports = carousel;
