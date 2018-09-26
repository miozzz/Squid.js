{
    const Modal = sq.newComponent('sq:Modal');

    Modal.prototype.init = function () {
        const me = this
        me.addEvents(['show', 'close'])
    }

    Modal.prototype.load = function () {
        const me = this
        let backdrop = me.dom
        let closebtn = me.dom.querySelector("[name=close]")
        
        closebtn.addEventListener('click', function() {
            me.close()
        });

        backdrop.addEventListener('click', function (e) {
            if(!me._nobackdrop && !e.target.closest('div[name=content]')) me.close() 
        });
    }

    Modal.prototype.show = function (value) {
        const me = this
        if(me.onbeforeshow()) {
            window.getComputedStyle(me.dom).opacity
            me.dom.classList.add('show')
            me.trigger('show')
        }
    }

    Modal.prototype.close = function (value) {
        const me = this
        if (me.onbeforeclose()) {
            window.getComputedStyle(me.dom).opacity;
            me.dom.classList.remove('show')
            me.trigger('close')
        }
    }

    Modal.prototype.onbeforeshow = function () {
        const me = this
        return true
    }

    Modal.prototype.onbeforeclose = function () {
        const me = this
        return true
    }

    Modal.prototype.heading = function (value) {
        const me = this
        let titleDom = me.dom.querySelector("span[name=title]")
        if (value === undefined)
            return titleDom.textContent
        titleDom.textContent = value
    }

    Modal.prototype.nobackdrop = function (value) {
        const me = this
        if (value === undefined)
            return me.backdropevt
        me._nobackdrop = (value.toLowerCase() === 'true')
    }

}