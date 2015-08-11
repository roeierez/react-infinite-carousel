var React = require('react'),
    SCROLLING_TIME_CONSTANT = 250;

var HorizontalScroller = React.createClass ({

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

    track: function() {
        var now, elapsed, delta, v;

        now = Date.now();
        elapsed = now - this.timestamp;
        this.timestamp = now;
        delta = this.offset - this.frame;
        this.frame = this.offset;

        v = 1000 * delta / (1 + elapsed);
        this.velocity = 0.8 * v + 0.2 * this.velocity;
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
            if (delta > 10 || delta < -10) {
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
        clearInterval(this.ticker);
        this.ticker = setInterval(this.track, 10);

        e.preventDefault();
        e.stopPropagation();
    },

    drag: function(e) {
        var x, delta;
        if (this.pressed) {
            x = this.xpos(e);
            delta = this.reference - x;
            if (delta > 2 || delta < -2) {
                this.reference = x;
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
        if (this.velocity == 0) {
            if (this.offset % snap != 0) {
                this.target = (this.offset % snap) < snap / 2 ? Math.ceil(this.offset / snap) * snap - snap : Math.floor(this.offset / snap) * snap + snap;
            }
        } else {
            this.target = this.velocity < 0 ? Math.ceil(this.offset / snap) * snap - snap : Math.floor(this.offset / snap) * snap + snap;
        }

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
