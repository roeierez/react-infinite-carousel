# react-infinite-carousel
Infinite carousel with progress control built with React.

<p>See <a href="http://roeierez.github.io/react-infinite-carousel/demo/" target="_blank">Live demo</a></p>

The user has the ability to control the items rendering and background rendering at any stage.
The component gets "itemRenderer" function that gets index and progress as input and should return a React component.
The progress is a number between 0 to 1 which reflects the position of the item on the screen.
This enables the user to render according to position on screen, for example change opacity brightness scaling...

## Quick Start
```
var content = document.getElementById('content'),
    backgroundRenderer = function(index){
      return <img src={"backgroundImage.jpg"} width: '100%', height: '100%'/>
    },
    itemRenderer = function(index, progress){
      return <div>{"Item number " + index} </div>
    };
    
React.render(<Carousel
                backgroundRenderer={backgroundRenderer}
                itemRenderer={itemRenderer}
                itemsCount={10}
            />, content);

```
## Installation
react-infinite-carousel uses a Universal Module Definition so you can use it with both CommonJS and RequireJS.

### CommonJS
```
require('react-infinite-carousel')
```

### RequireJS
```
define(['[path to project]/dist/Carousel.js'], function(carousel){
  //your code goes here
});
```

### In the Browser
If you need it as a standalone script that is referenced from your html file then just include dist/Carousel.js and you have it on the global scope. 

### bower
bower install react-infinite-carousel

#Building the examples
```bash
    cd examples
    webpack
```
