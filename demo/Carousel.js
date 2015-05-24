!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(require("react")):"function"==typeof define&&define.amd?define(["react"],e):"object"==typeof exports?exports.Carousel=e(require("react")):t.Carousel=e(t.React)}(this,function(t){return function(t){function e(s){if(i[s])return i[s].exports;var r=i[s]={exports:{},id:s,loaded:!1};return t[s].call(r.exports,r,r.exports,e),r.loaded=!0,r.exports}var i={};return e.m=t,e.c=i,e.p="",e(0)}([function(t,e,i){var s=i(1),r=i(2),n=i(3),o=2,a=s.createClass({displayName:"carousel",getInitialState:function(){return{centeredItemIndex:0,centerItemProgress:.5}},componentDidMount:function(){this.containerWidth=s.findDOMNode(this).clientWidth,window.addEventListener("resize",this.onResize.bind(this)),this.forceUpdate()},componentWillUnmount:function(){window.removeEventListener("resize",this.onResize.bind(this))},onResize:function(){this.containerWidth=s.findDOMNode(this).clientWidth,this.forceUpdate()},getItemWidth:function(){return this.props.itemWidth||this.containerWidth/2||0},getItemsPerSide:function(){return this.props.numberOfRenderItemsPerSide||o},getScrollerSize:function(){return(this.props.itemsCount-1)*(this.getItemWidth()+this.getItemsSpacing())},getItemsSpacing:function(){return this.props.spacing||this.getItemWidth()/6||0},onScroll:function(t){var e=this.getItemsSpacing(),i=this.getItemWidth()+e,s=Math.max(0,Math.min(this.props.itemsCount-1,this.getCenterLeavingItem(t,i))),r=s*i-this.containerWidth/2-this.getItemWidth()/2,n=(t-r)/(this.containerWidth+this.getItemWidth());this.setState({centeredItemIndex:s,centerItemProgress:n})},getCenterLeavingItem:function(t,e){var i=this.state.centeredItemIndex,s=Math.floor(t/e),r=Math.ceil(t/e);return i=s>=this.state.centeredItemIndex?s:r},renderCarouselItem:function(t,e){var i=this.getItemWidth(),r=this.containerWidth,o=(e+i)/(r+i),a=n.applyTranslateStyle({justifyContent:"center",display:"flex",flexDirection:"column",width:this.getItemWidth(),height:"100%",position:"absolute",top:"0px",left:"0px"},e,0,0);return s.createElement("div",{key:"carouselItem"+t%(2*this.getItemsPerSide()+1),style:a},this.props.itemRenderer(t,o))},renderBackgroundItem:function(t,e,i){var r=this.getItemWidth(),o=this.getItemsSpacing(),a=this.containerWidth,h=Math.abs(e-a/2+r/2),c=i?i:1-h/(r/2+o),p=n.applyTranslateStyle({opacity:c,width:a,height:"100%",position:"absolute",top:"0px",left:"0px"},0,0,0);return s.createElement("div",{key:"background"+t,style:p},this.props.backgroundRenderer(t))},render:function(){for(var t=this.getItemWidth(),e=this.containerWidth,i=this.getItemsSpacing(),n=this.containerWidth-this.state.centerItemProgress*(this.containerWidth+t)||0,o=[this.renderCarouselItem(this.state.centeredItemIndex,n)],a=1;a<=this.getItemsPerSide();++a)this.state.centeredItemIndex-a>=0&&o.unshift(this.renderCarouselItem(this.state.centeredItemIndex-a,n-a*i-a*t)),this.state.centeredItemIndex+a<this.props.itemsCount&&o.push(this.renderCarouselItem(this.state.centeredItemIndex+a,n+a*i+a*t));var h=this.renderBackgroundItem(this.state.centeredItemIndex,n,1),c=h,p=this.state.centerItemProgress>.5;return p?this.state.centeredItemIndex<this.props.itemsCount-1&&(c=this.renderBackgroundItem(this.state.centeredItemIndex+1,n+i+t)):this.state.centeredItemIndex>0&&(c=this.renderBackgroundItem(this.state.centeredItemIndex-1,n-i-t)),s.createElement(r,{size:this.getScrollerSize(),snap:t+i,onScroll:this.onScroll},s.createElement("div",{style:{width:e,height:"100%",overflow:"hidden",position:"relative"}},h,c,o))}});a.propTypes={backgroundRenderer:s.PropTypes.func,itemRenderer:s.PropTypes.func,itemWidth:s.PropTypes.number,containerWidth:s.PropTypes.number,spacing:s.PropTypes.number,numberOfRenderItemsPerSide:s.PropTypes.number,itemsCount:s.PropTypes.number},t.exports=a},function(e,i,s){e.exports=t},function(t,e,i){var s=i(1),r=250,n=s.createClass({displayName:"HorizontalScroller",timestamp:0,frame:0,velocity:0,amplitude:0,pressed:0,ticker:0,reference:0,offset:0,target:0,render:function(){return s.createElement("div",{onTouchStart:this.tap,onTouchMove:this.drag,onTouchEnd:this.release,onMouseDown:this.tap,onMouseMove:this.drag,onMouseUp:this.release,style:{height:"100%",width:"100%"}},s.Children.only(this.props.children))},xpos:function(t){return t.targetTouches&&t.targetTouches.length>=1?t.targetTouches[0].clientX:t.clientX},track:function(){var t,e,i,s;t=Date.now(),e=t-this.timestamp,this.timestamp=t,i=this.offset-this.frame,this.frame=this.offset,s=1e3*i/(1+e),this.velocity=.8*s+.2*this.velocity},scroll:function(t){this.offset=t,this.props.onScroll(t)},autoScroll:function(){var t,e;this.amplitude&&(t=Date.now()-this.timestamp,e=this.amplitude*Math.exp(-t/r),e>10||-10>e?(this.scroll(this.target-e),requestAnimationFrame(this.autoScroll)):this.scroll(this.target))},tap:function(t){this.pressed=!0,this.reference=this.xpos(t),this.velocity=this.amplitude=0,this.frame=this.offset,this.timestamp=Date.now(),clearInterval(this.ticker),this.ticker=setInterval(this.track,10),t.preventDefault(),t.stopPropagation()},drag:function(t){var e,i;this.pressed&&(e=this.xpos(t),i=this.reference-e,(i>2||-2>i)&&(this.reference=e,this.scroll(this.offset+i))),t.preventDefault(),t.stopPropagation()},release:function(t){var e=this.props.snap;this.pressed=!1,clearInterval(this.ticker),this.target=this.offset,(this.velocity>10||this.velocity<-10)&&(this.amplitude=1.2*this.velocity,this.target=this.offset+this.amplitude),Math.floor(this.offset/e)*e<this.target?this.target=Math.floor(this.offset/e)*e+e:Math.ceil(this.offset/e)*e>this.target&&(this.target=Math.ceil(this.offset/e)*e-e),"number"==typeof this.props.size&&(this.target=Math.max(0,Math.min(this.props.size,Math.round(this.target/e)*e))),this.amplitude=this.target-this.offset,this.timestamp=Date.now(),requestAnimationFrame(this.autoScroll),t.preventDefault(),t.stopPropagation()}});n.propTypes={onScroll:s.PropTypes.func,snap:s.PropTypes.number,size:s.PropTypes.number},t.exports=n},function(t,e,i){t.exports={applyTranslateStyle:function(t,e,i,s){var r="translate3d("+e.toString()+"px,"+i+"px,"+s+"px)";return t.Transform=r,t.WebkitTransform=r,t.MsTransform=r,t.MozTransform=r,t}}}])});