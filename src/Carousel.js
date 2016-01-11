var React = require('react'),
    ReactDOM = require('react-dom'),
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
        this.parentElementWidth = ReactDOM.findDOMNode(this).parentElement.clientWidth;
        window.addEventListener('resize', this.onResize);
        this.refs.scroller.scroll( (this.getItemWidth() + this.getItemsSpacing()) * (this.props.initialItemIndex || 0) );
        this.forceUpdate();
    },

    componentWillUnmount: function(){
        window.removeEventListener('resize', this.onResize);
    },

    onResize: function(){
        this.parentElementWidth = ReactDOM.findDOMNode(this).parentElement.clientWidth;
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
            <div key={"carouselItem" + (index % (2 * this.getItemsPerSide() + 1 ))} style={itemStyle}>
                {this.props.itemRenderer(index, itemProgress)}
            </div>
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

                <div style={{width: this.getContainerWidth(), height: '100%', overflow: 'hidden', position: 'relative'}}>
                    {this.renderBackground()}
                    <HorizontalScroller ref="scroller" size={this.getScrollerSize()} snap={this.getItemWidth() + this.getItemsSpacing()} onScroll={this.onScroll}>
                        <div style={{position: 'absolute', height: '100%', width: '100%', top: 0, left: 0}}>
                            {this.renderItems()}
                        </div>
                    </HorizontalScroller>
                </div>

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
    initialItemIndex: React.PropTypes.number
};

module.exports = carousel;
