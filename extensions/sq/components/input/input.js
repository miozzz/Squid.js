{
    const Input = sq.newComponent('sq:input');

    Input.prototype.init = function () {
        const me = this
        me.option = null

    }

    Input.prototype.load = function () {
        const me = this

    }

    Input.prototype.type = function (value) {
        const me = this
        if (value === undefined)
            return me.dom.getAttribute('type')
                
        me.dom.setAttribute('type',value)
        if (value == "select")
            me.setSelect()
    }

    Input.prototype.data = function (value) {
        const me = this
        if (value === undefined)
            return me.option
        try { 
            me.option = JSON.parse(value) 
            me.setOption()
        } catch (err) { 
            if (value == "undefined")
                me.dom.removeAttribute('data')
        }
    }

    Input.prototype.setSelect = function () {
        const me = this

        let orig = me.dom
        let select = document.createElement('select');
        while (orig.firstChild) {
            select.appendChild(orig.firstChild); // *Moves* the child
        }
    
        for (var i = orig.attributes.length - 1; i >= 0; --i) {
            select.attributes.setNamedItem(orig.attributes[i].cloneNode());
        }
    
        // Replace it
        select.sq = orig.sq
        orig.parentNode.replaceChild(select, orig);

    }

    Input.prototype.setOption = function (option = this.option) {
        const me = this

        Object.keys(me.option)
            .forEach(function(key){
                let option = document.createElement('OPTION')
                option.setAttribute('value', key)
                option.textContent = me.option[key]
                me.dom.appendChild(option)
        })

    }

}