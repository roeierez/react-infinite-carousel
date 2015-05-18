var Carousel = require('../src/Carousel')
var React = require('react');

var images = [
    "https://c2.staticflickr.com/8/7622/16890755905_3443c134ed.jpg",
    "https://c2.staticflickr.com/8/7638/16887801332_d23f691cd2.jpg",
    "https://c1.staticflickr.com/9/8693/16703132590_e6b1ab0793.jpg"
];

var content = document.getElementById('content'),
    itemRenderer = function (index, progress) {
        var opacity = progress < 0.5 ? progress * 2 : (1 - progress) * 2;
        return <div style={{height: '50%'}}>
            <div style={{
                height: '100%',
                border: 'solid 2px white',
                color: 'white'
            }}>
            </div>
            <div style={{opacity: opacity, color: 'white', marginTop: '20px'}}>{"Document " + index.toString()}</div>
        </div>;
    },

    backgroundRenderer = function (index) {
        return <img style={{width: '100%', height: '100%'}} src={images[index % 3]} />;
    }

React.render(<Carousel
    spacing={50}
    backgroundRenderer={backgroundRenderer}
    itemRenderer={itemRenderer}
    itemWidth={screen.width / 3 + 20}
    containerWidth={screen.width}
/>, content);

