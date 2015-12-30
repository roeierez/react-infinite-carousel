var React = require('react'),
    SCROLLING_TIME_CONSTANT =   250;

var HorizontalScroller = React.createClass ({
    getInitialState: function() {
        return {
            offset: this.props.centeredItemIndex ? this.props.centeredItemIndex * this.props.snap : 0
        };
    },
    timestamp: 0,
    frame: 0,
    velocity:0,
    amplitude: 0,
    pressed: 0,
    ticker: 0,
    reference: 0,
    target: 0,

    render: function() {
        //return React.Children.only(this.props.children);
        return <div
                    onTouchStart={this.tap}
                    onTouchMove={this.drag}
                    onTouchEnd={this.release}
                    onMouseDown={this.tap}
                    onMouseMove={this.drag}
                    onMouseUp={this.release}
                    style={{height: '100%', width: '100%'}}>{React.Children.only(this.props.children)}
            </div>;
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
        this.state.offset = x;
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
        this.frame = this.state.offset;
        this.timestamp = Date.now();
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
                this.scroll(this.state.offset + delta);
            }
        }
    },

    release: function(e) {
        var snap = this.props.snap;
        this.pressed = false;
        clearInterval(this.ticker);

        this.amplitude = this.velocity;
        this.target = this.state.offset;
        if (this.amplitude != 0) {
            if (this.amplitude > 0) {
                this.target   = Math.ceil(this.state.offset / snap) * snap;
            } else {
                this.target   = Math.floor(this.state.offset / snap) * snap;
            }
        }

        this.target = Math.round(this.target / snap) * snap;

        if (typeof this.props.size == 'number') {
            this.target = Math.max(0, Math.min(this.props.size, Math.round(this.target / snap) * snap));
        }

        this.amplitude = this.target - this.state.offset;
        this.timestamp = Date.now();
        requestAnimationFrame(this.autoScroll);
    }
});

HorizontalScroller.propTypes = {
    onScroll: React.PropTypes.func,
    snap: React.PropTypes.number,
    size: React.PropTypes.number
}

module.exports = HorizontalScroller;
