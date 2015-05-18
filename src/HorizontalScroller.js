var React = require('react'),
    SCROLLING_TIME_CONSTANT = 325;

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
        return React.Children.only(this.props.children);
    },

    componentDidMount: function(){
        this.setupEvents();
    },

    setupEvents: function () {
        var view = React.findDOMNode(this);
        if (typeof window.ontouchstart !== 'undefined') {
            view.addEventListener('touchstart', this.tap.bind(this));
            view.addEventListener('touchmove', this.drag.bind(this));
            view.addEventListener('touchend', this.release.bind(this));
        }
        view.addEventListener('mousedown', this.tap.bind(this));
        view.addEventListener('mousemove', this.drag.bind(this));
        view.addEventListener('mouseup', this.release.bind(this));
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
                requestAnimationFrame(this.autoScroll.bind(this));
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
        this.ticker = setInterval(this.track.bind(this), 10);

        e.preventDefault();
        e.stopPropagation();
        return false;
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
        return false;
    },

    release: function(e) {
        var snap = this.props.snap;
        this.pressed = false;

        clearInterval(this.ticker);
        this.target = this.offset;
        if (this.velocity > 10 || this.velocity < -10) {
            this.amplitude = 1.2 * this.velocity;
            this.target = this.offset + this.amplitude;
        }
        this.target = Math.round(this.target / snap) * snap;

        if (Math.floor(this.offset / snap) * snap < this.target) {
            this.target = Math.floor(this.offset / snap) * snap + snap;
        } else if (Math.ceil(this.offset / snap) * snap > this.target) {
            this.target = Math.ceil(this.offset / snap) * snap - snap;
        }

        this.amplitude = this.target - this.offset;
        this.timestamp = Date.now();
        requestAnimationFrame(this.autoScroll.bind(this));

        e.preventDefault();
        e.stopPropagation();
        return false;
    }
});

HorizontalScroller.propTypes = {
    onScroll: React.PropTypes.func,
    snap: React.PropTypes.number
}

module.exports = HorizontalScroller;
