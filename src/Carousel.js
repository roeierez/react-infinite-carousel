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

    onScroll: function (offset) {
        var itemsSpacing = 50,
            distanceBetweenItems = this.props.itemWidth + itemsSpacing,
            centeredItem = this.getCenterLeavingItem(offset, distanceBetweenItems),
            containerStartOffset = centeredItem * distanceBetweenItems - this.props.containerWidth / 2 - this.props.itemWidth / 2,
            relativeProgress = (offset - containerStartOffset) / (this.props.containerWidth + this.props.itemWidth);

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
        var itemWidth = this.props.itemWidth,
            containerWidth = this.props.containerWidth,
            progress = (translateX + itemWidth) / (containerWidth + itemWidth),
            itemStyle = StyleHelper.applyTranslateStyle({
                justifyContent: 'center',
                display: 'flex',
                flexDirection: 'column',
                width: this.props.itemWidth,
                height: '100%',
                position: 'absolute',
                top: '0px',
                left: '0px'
            }, translateX, 0, 0);

        return (
            <div key={"carouselItem" + (index % (2 * DEFAULT_ITEMS_TO_RENDER_COUNT + 1))} style={itemStyle}>
                {this.props.itemRenderer(index, progress)}
            </div>
        );
    },

    renderBackgroundItem: function (index, translateX, givenOpacity) {
        var itemWidth = this.props.itemWidth,
            itemsSpacing = this.props.spacing,
            containerWidth = this.props.containerWidth,
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
        var itemWidth = this.props.itemWidth,
            containerWidth = this.props.containerWidth,
            itemsSpacing = this.props.spacing,

            centerItemTranslateX = this.props.containerWidth - (this.state.centerItemProgress * (this.props.containerWidth + this.props.itemWidth)),
            itemsToRender = [this.renderCarouselItem(this.state.centeredItemIndex, centerItemTranslateX)];

        for (var i = 1; i <= DEFAULT_ITEMS_TO_RENDER_COUNT; ++i) {
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
            <HorizontalScroller snap={itemWidth + itemsSpacing} onScroll={this.onScroll.bind(this)}>
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
    containerWidth: React.PropTypes.number,
    spacing: React.PropTypes.number
};

module.exports = carousel;
