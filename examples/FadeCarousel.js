var Carousel = require('../src/Carousel')
var React = require('react');

var images = [
        "https://c2.staticflickr.com/8/7622/16890755905_3443c134ed.jpg",
        "https://c2.staticflickr.com/8/7638/16887801332_d23f691cd2.jpg",
        "https://c1.staticflickr.com/9/8693/16703132590_e6b1ab0793.jpg"
    ],
    contentImages = [
        {url: 'https://c2.staticflickr.com/6/5455/17859625915_9afaa75f20_h.jpg', text: 'Misty Sunset'},
        {url: 'https://c2.staticflickr.com/6/5322/17870358831_112d634d03_h.jpg', text: 'For the souls of the sea'},
        {url: 'https://c2.staticflickr.com/6/5469/17244068574_926d50213c_h.jpg', text: 'Golden Pyramid'},
        {url: 'https://c1.staticflickr.com/9/8798/17870330381_050cdf7836_b.jpg', text: 'The quiet beginning of a new day'},
        {url: 'https://c2.staticflickr.com/8/7785/17859738545_de14da942c_h.jpg', text:'the woods are alive...'}
    ];

var content = document.getElementById('content'),
    itemRenderer = function (index, progress) {
        var opacity = progress < 0.5 ? progress * 2 : (1 - progress) * 2;

        return <div className="item">
            <div className="itemImageWrapper" style={{opacity: opacity}}>
                <img src={contentImages[index % 5].url} width='100%' height='100%'/>
            </div>
            <div className="textWrapper" style={{opacity: opacity}} >{contentImages[index % 5].text}</div>
        </div>;
    },

    backgroundRenderer = function(fromIndex, toIndex, progress){
        var children = [
                <img  key={"bgImage " + (toIndex % 3)} className="backgroundImage" src={images[toIndex % 3]} />
            ],
            fadeOutOpacity = progress < 0.5 ? 1 : (1-progress) * 2;

        if (fromIndex != toIndex){
            children.push(<img key={"bgImage " + (fromIndex % 3)} className="backgroundImage" style={{opacity: fadeOutOpacity}} src={images[fromIndex % 3]} />);
        }

        return <div style={{filter: 'brightness(30%)', WebkitFilter: 'brightness(40%)', width: '100%', height: '100%'}}>
                    {children}
                </div>
    }

React.render(<Carousel
    backgroundRenderer={backgroundRenderer}
    itemRenderer={itemRenderer}
    itemsCount={10}
/>, content);

