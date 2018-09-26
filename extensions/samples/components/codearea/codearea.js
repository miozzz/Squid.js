{
    const Codearea = sq.newComponent('samples:codearea');

    Codearea.prototype.init = function () {
        const me = this;
        
    }

    Codearea.prototype.title = function(value){
        const me = this
        me.dom.querySelector('label').textContent = value
    }

    Codearea.prototype.value = function(value){
        const me = this
        console.log(value)
        if(value=='${@data}') return
        if(value === undefined) return JSON.parse(me.dom.querySelector('pre').textContent)
        me.dom.querySelector('pre').textContent = sq.isObject(value)? JSON.stringify(value, null, "\t") : value;
        
    }
    
}