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
        window.addEventListener('resize', this.onResize.bind(this));
        this.forceUpdate();
    },

    componentWillUnmount: function(){
        window.removeEventListener('resize', this.onResize.bind(this));
    },

    onResize: function(){
        this.containerWidth = React.findDOMNode(this).clientWidth;
        this.forceUpdate();
    },

    getItemWidth: function(){
        return this.props.itemWidth || this.containerWidth / 2 || 0;
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
        console.error('offset = ' + offset + ' maxsize=' + this.getScrollerSize());
        var itemsSpacing = this.getItemsSpacing(),
            distanceBetweenItems = this.getItemWidth() + itemsSpacing,
            centeredItem = Math.max(0, Math.min(this.props.itemsCount - 1,  this.getCenterLeavingItem(offset, distanceBetweenItems) )),
            containerStartOffset = centeredItem * distanceBetweenItems - this.containerWidth / 2 - this.getItemWidth() / 2,
            relativeProgress = (offset - containerStartOffset) / (this.containerWidth + this.getItemWidth());

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
            containerWidth = this.containerWidth,
            itemsSpacing = this.getItemsSpacing(),

            centerItemTranslateX = (this.containerWidth - (this.state.centerItemProgress * (this.containerWidth + itemWidth))) || 0,
            itemsToRender = [this.renderCarouselItem(this.state.centeredItemIndex, centerItemTranslateX)];

        for (var i = 1; i <= this.getItemsPerSide(); ++i) {
            if (this.state.centeredItemIndex - i >= 0) {
                itemsToRender.unshift(this.renderCarouselItem(this.state.centeredItemIndex - i, centerItemTranslateX - i * itemsSpacing - i * itemWidth));
            }

            if (this.state.centeredItemIndex + i < this.props.itemsCount)
            itemsToRender.push(this.renderCarouselItem(this.state.centeredItemIndex + i, centerItemTranslateX + i * itemsSpacing + i * itemWidth));
        }

        var scrolledOutItemBackground = this.renderBackgroundItem(this.state.centeredItemIndex, centerItemTranslateX, 1),
            scrolledInItemBackground = scrolledOutItemBackground,
            scrollingRight = this.state.centerItemProgress > 0.5;

        if (scrollingRight) {
            if (this.state.centeredItemIndex < this.props.itemsCount - 1) {
                scrolledInItemBackground = this.renderBackgroundItem(this.state.centeredItemIndex + 1, centerItemTranslateX + itemsSpacing + itemWidth);
            }
        } else if (this.state.centeredItemIndex > 0 ) {
            scrolledInItemBackground = this.renderBackgroundItem(this.state.centeredItemIndex - 1, centerItemTranslateX - itemsSpacing - itemWidth);
        }


        return (
            <HorizontalScroller size={this.getScrollerSize()} snap={itemWidth + itemsSpacing} onScroll={this.onScroll}>
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
    numberOfRenderItemsPerSide: React.PropTypes.number,
    itemsCount: React.PropTypes.number
};

module.exports = carousel;
