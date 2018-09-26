{
    const sqx = new sq.Namespace("sq");
   
    sqx.loadComponents({ 
        "components": {
            "treegrid": [],
            "login":[],
            "banner":[],
            "modal": [],
            "input":[],
            "form":[],
            "tabcontrol":[],
            "modal": []
        }
    });

    const selectorString = function(componentName, nameAttribute, selector) {
        var s = selector || '';
        s += (componentName === undefined) ? '' : ('.' + componentName);
        s += (nameAttribute === undefined) ? '' : '[name="' + nameAttribute + '"]';
        return s;
    }

    sq.Component.prototype.child = function(componentName, nameAttribute, selector) {
        if (!this.dom || !this.dom.sq) return null;
        const sel = selectorString(componentName, nameAttribute, selector);
        const element = this.dom.querySelector(sel);
        if (!element) return null;
        return element.sq
    }

    sq.Component.prototype.children = function(componentName, nameAttribute, selector) {
        if (!this.dom || !this.dom.sq) return null;
        const ret = [];
        const sel = selectorString(componentName, nameAttribute, selector);
        const elements = this.dom.querySelectorAll(sel);
        if (!elements) return null;

        for (var i = 0; i < elements.length; i++) ret.push(elements[i].sq);
        return ret;
    }

    sq.Component.prototype.addEvent = function(event) {
        this.__events__[event] = [];
        return this;
    }

    sq.Component.prototype.addEvents = function(events) {
        for (i = 0; i < events.length; i++)
            this.__events__[events[i]] = [];
        return this;
    }

    sq.Component.prototype.on = function(event, handler) {
        if (!this.__events__[event]) return console.warn('The event ' + event + ' is not defined.');
        this.__events__[event].push(handler);
        return this;
    }

    sq.Component.prototype.trigger = function(event, params) {
        const me = this
        if (!me.__events__[event]) return console.warn('ERROR: The event ' + event + ' does not exist.');
        me.__events__[event].forEach((fn)=>{
            fn.apply(me,[params])
        }) 
    }

    sq.Component.prototype.getData = function() {
        sq.getData(this.dom)
    }

    sq.Component.prototype.setData = function(value) {
        sq.setData(this.dom, value)
    }

}