sq.controllers.selectable = class Selectable extends sq.Controller {
    constructor(dom, key) {
        super(dom, key, 'selectable')
        const me = this
        me.toScroll = true
        me.observer = null
        me.events = function () { }
        me.events['selected'] = []
        me.events['change'] = []
        me.selected = function (value) {
            if (value === undefined)
                return this.dom.querySelector('.selected')
            me.select(value);
        }
        me.value = (value) => {
            if (value === undefined)
                return this.dom.getAttribute('sq-selectable')
            this.dom.setAttribute('sq-selectable', value)
        }
        sq.controllers.selectable.bind.call(me)
        me.stack = []
        sq.controllers.selectable.observe.call(me)
        return me
    }

    on(event, handler) {
        this.events[event].push(handler);
    }

    trigger(event, params) {
        for (var i = 0; i < this.events[event].length; i++) {
            this.events[event][i].apply(this, params)
        }
    }

    select(child) {
        const me = this;
        if ((me.value() == 'false') || (!child) || child.classList.contains('selected')) return;

        if (child.classList.contains('selected')) return child.classList.remove('selected');

        const doms = [].slice.call(me.dom.querySelectorAll('.selected'))
        if (me.value() != 'multiple') {
            doms.forEach(function (dom) {
                dom.classList.remove('selected')
            })
        }

        child.classList.add('selected')
        me.trigger('selected', [{
            item: child
        }])
        me.trigger('change', [{
            selected: child,
            previousSelection: doms
        }])
        if (scroll) me.scroll(child, me.toScroll)
        return child
    }

    selectPrevious() {
        let sel = this.selected()
        if (!sel) return null
        const siblings = sq.controllers.selectable.getPreviousSiblings(sel, function (dom) {
            return !dom.classList.contains('hidden')
        })
        if (siblings.length) return this.select(siblings[0], true)
        return null;
    }

    static getPreviousSiblings(el, filter) {
        let siblings = []
        while (el = el.previousSibling) {
            if (!filter || filter(el)) siblings.push(el)
        }
        return siblings
    }

    selectNext() {
        let sel = this.selected()
        if (!sel) return null
        const siblings = sq.controllers.selectable.getNextSiblings(sel, function (dom) {
            return !dom.classList.contains('hidden')
        })
        if (siblings.length) return this.select(siblings[0], true)
        return null;
    }

    static getNextSiblings(el, filter) {
        let siblings = []
        while (el = el.nextSibling) {
            if (!filter || filter(el)) siblings.push(el)
        }
        return siblings
    }

    scroll(item, up) {
        let me = this;
        let container = me.getScrollParent()
        if (!me.scrollToView(item, container)) {
            item.scrollIntoView(up);
        }
    }

    scrollToView(elem, div) {
        let elemrect = elem.getBoundingClientRect()
        let divrect = div.getBoundingClientRect()
        let docViewTop = divrect.top + div.clientTop
        let docViewBottom = docViewTop + div.clientHeight
        let elemTop = elemrect.top
        let elemBottom = elemTop + elem.clientHeight
        return ((elemTop >= docViewTop) && (elemBottom <= docViewBottom))
    }

    getScrollParent(node = this.dom) {
        if (node == null) return document.body
        if (node.scrollHeight > node.clientHeight) return node
        return this.getScrollParent(node.parentNode)
    }

    static bind(domList) {
        const me = this
        if (!domList) domList = [].slice.call(me.dom.children)
        domList.forEach(function (child) {
            child.classList.add('item_selectables')
            child.addEventListener('click', function () {
                me.select(child)
            });
        });
        return 
    }

    static observe(){
        const me = this
        sq.observeMutations(me.dom, function (mutation, index, mutArr) {
            if (mutation.addedNodes.length) {
                me.stack.push(mutation.addedNodes[0])
                if (index == mutArr.length - 1) {
                    sq.controllers.selectable.bind.call(me, me.stack)
                    me.stack = []
                }
            }

        }, { childList: true, attributes:false })
    }


}