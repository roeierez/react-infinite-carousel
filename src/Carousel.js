var React = require('react'),
    HorizontalScroller = require('./HorizontalScroller.js'),
    StyleHelper = require('./StyleHelper.js'),
    DEFAULT_ITEMS_TO_RENDER_COUNT = 2,
    DEFAULT_ITEM_SPACING = 50;

var carousel = React.createClass({

    getInitialState: function () {
        return {
            centeredItemIndex: 0,
            centerItemProgress: 0.5
        };
    },

    componentDidMount: function(){
        this.containerWidth = React.findDOMNode(this).clientWidth;
        this.forceUpdate();
    },

    getItemWidth: function(){
        return this.props.itemWidth || this.containerWidth / 3;
    },

    getItemsPerSide: function(){
        return this.props.numberOfRenderItemsPerSide || DEFAULT_ITEMS_TO_RENDER_COUNT;
    },

    getItemsSpacing: function(){
        return this.props.spacing || this.getItemWidth() / 2;
    },

    onScroll: function (offset) {
        var itemsSpacing = this.getItemsSpacing(),
            distanceBetweenItems = this.getItemWidth() + itemsSpacing,
            centeredItem = this.getCenterLeavingItem(offset, distanceBetweenItems),
            containerStartOffset = centeredItem * distanceBetweenItems - this.containerWidth / 2 - this.getItemWidth() / 2,
            relativeProgress = (offset - containerStartOffset) / (this.containerWidth + this.getItemWidth());

        this.setState({
            centeredItemIndex: centeredItem,
            centerItemProgress: relativeProgress
        });
    },

    getCenterLeavingItem: function (offset, distanceBetweenItems) {
        var centerLeavingItem = Math.round(offset / distanceBetweenItems);
        if (offset % distanceBetweenItems > 0 && Math.abs(centerLeavingItem - this.state.centeredItemIndex) <= 1) {
            centerLeavingItem = this.state.centeredItemIndex;
        }
        return centerLeavingItem;
    },

    renderCarouselItem: function (index, translateX) {
        var itemWidth = this.getItemWidth(),
            containerWidth = this.containerWidth,
            progress = (translateX + itemWidth) / (containerWidth + itemWidth),
            itemStyle = StyleHelper.applyTranslateStyle({
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
            containerWidth = this.containerWidth,
            distanceFromCenter1 = Math.abs(translateX - containerWidth / 2 + itemWidth / 2),
            opacity = givenOpacity ? givenOpacity : 1 - distanceFromCenter1 / (itemWidth / 2 + itemsSpacing);

        return (
            <div key={"background" + index} style={{
                opacity: opacity,
                width: containerWidth,
                height: '100%',
                position: 'absolute',
                top: '0px',
                left: '0px'
            }}>
                {this.props.backgroundRenderer(index)}
            </div>
        );
    },

    render: function () {
        var itemWidth = this.getItemWidth(),
            containerWidth = this.containerWidth,
            itemsSpacing = this.getItemsSpacing(),

            centerItemTranslateX = this.containerWidth - (this.state.centerItemProgress * (this.containerWidth + itemWidth)),
            itemsToRender = [this.renderCarouselItem(this.state.centeredItemIndex, centerItemTranslateX)];

        for (var i = 1; i <= this.getItemsPerSide(); ++i) {
            itemsToRender.unshift(this.renderCarouselItem(this.state.centeredItemIndex - i, centerItemTranslateX - i * itemsSpacing - i * itemWidth));
            itemsToRender.push(this.renderCarouselItem(this.state.centeredItemIndex + i, centerItemTranslateX + i * itemsSpacing + i * itemWidth));
        }

        var scrolledOutItemBackground = this.renderBackgroundItem(this.state.centeredItemIndex, centerItemTranslateX, 1),
            scrolledInItemBackground = null,
            scrollingRight = this.state.centerItemProgress > 0.5;

        if (scrollingRight) {
            scrolledInItemBackground = this.renderBackgroundItem(this.state.centeredItemIndex + 1, centerItemTranslateX + itemsSpacing + itemWidth);
        } else {
            scrolledInItemBackground = this.renderBackgroundItem(this.state.centeredItemIndex - 1, centerItemTranslateX - itemsSpacing - itemWidth);
        }


        return (
            <HorizontalScroller snap={itemWidth + itemsSpacing} onScroll={this.onScroll}>
                <div onResize style={{width: containerWidth, height: '100%', overflow: 'hidden', position: 'relative'}}>
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
    containerWidth: React.PropTypes.number,
    spacing: React.PropTypes.number,
    numberOfRenderItemsPerSide: React.PropTypes.number
};

module.exports = carousel;
