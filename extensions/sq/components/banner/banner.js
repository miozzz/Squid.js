{
    const Banner = sq.newComponent('sq:banner');

    Banner.prototype.load = function () {
        const me = this;
       
    }
    Banner.prototype.imgsrc = function(url){
        const me = this
        me.dom.querySelector('img[name=main]').src = url
    }

}