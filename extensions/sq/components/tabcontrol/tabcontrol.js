{
    const Tabcontrol = sq.newComponent('sq:tabcontrol');
    
    Tabcontrol.prototype.init = function () {
        const me = this
        me.stack = []
        initPromise.call(me)
        me.addEvent('tabclick')
        me.addEvent('tabclose')
    }

    Tabcontrol.prototype.__onparsenode__ = function () {
        initObserver.call(this)
    }

    Tabcontrol.prototype.__onbinddom__ = function(){
        const me = this
        me.btnpanel = me.dom.children.btnpanel
        me.tabpages = me.dom.children.tabpages
        if(!me.__placeholders__.body) return
        let children = [].slice.call(me.__placeholders__.body.children)
        spawnTabs.call(me, children, true)
        me.finish()
    }

    Tabcontrol.prototype.showTab = function (tabname) {
        const me = this
        me.trigger('tabclick', tabname)
        // activateTab.call(me, null, true)
        activateTab.call(me, tabname)
    }

    Tabcontrol.prototype.closeTab = function (tabname) {
        const me = this
        if(!me._closable) return false
        me.trigger('tabclose', tabname)
        let tab = me.dom.querySelector('.sq.tabpage[name="' + tabname + '"]')
        if(tab.classList.contains('active')) {
            if(tab.previousElementSibling) me.showTab(nameAttr(tab.previousElementSibling))
            else if (tab.nextElementSibling) me.showTab(nameAttr(tab.nextElementSibling))
        }
        tab.remove()
        me.dom.querySelector('.tabbutton[name="' + nameAttr(tab) + '"]').remove()
    }

    spawnTabs = function (arr, init) {
        const me = this
        arr.forEach((child, i)=>{
            child.classList.add('tabpage')
            child.classList.add(me.namespace.id)
            let btn = createButton.call(me, child)
            if(init && i == 0) {
                btn.classList.add('active')
                child.classList.add('active')
            }
        })
    }

    
    createButton = function (tabpage) {
        const me = this
        let btn = document.createElement('div')
        let txt = document.createElement('span')

        btn.classList.add('tabbutton')
        nameAttr(btn, nameAttr(tabpage))
        btn.addEventListener('click', () => { me.showTab(nameAttr(btn)) })

        txt.textContent = tabpage.getAttribute('heading') 
        btn.appendChild(txt)
        
        if(!tabpage.getAttribute('unclosable')) {
            let closebtn = document.createElement('button')
            btn.appendChild(closebtn)
            closebtn.addEventListener('click', (e) => { e.stopPropagation(); me.closeTab(nameAttr(btn)) })
        }

        me.btnpanel.appendChild(btn)
        return btn
    }

    activateTab = function (name, deactivate) {
        const me = this
        let tab = me.tabpages.children[name]
        let btn = me.btnpanel.children[name]
        if (tab) deactivate ? tab.classList.remove('active') : activate.call(me,tab,'tabpages')
        if (btn) deactivate ? btn.classList.remove('active') : activate.call(me,btn,'btnpanel')
    }

    activate = function(current,type){
        const me = this
        let children = [].slice.call(me[type].children)
        children.forEach((child)=>{
            child.classList.remove('active')
        })
        current.classList.add('active')
    }

    initObserver = function () {
        const me = this
        let body = me.dom.querySelector('[template=body]')
        sq.observeMutations(body, function (mutation, index, mutArr) {
            if (mutation.addedNodes.length) {
                initPromise.call(me)
                me.stack.push(mutation.addedNodes[0])
                if (index == mutArr.length - 1) {
                    spawnTabs.call(me, me.stack, null)
                    me.showTab(nameAttr(me.stack[0]))
                    me.stack = []
                    me.finish()
                }
            }

        }, { childList: true, attributes:false })
    }

    nameAttr = function (element, name) {
        if(name === undefined) {
            if (element.name) return element.name
            return element.getAttribute('name')
        }
        if(element.name) element.name = name
        element.setAttribute('name', name)
        return element
    }

    initPromise = function () {
        const me = this
        me.promise = new Promise((resolve, reject) => {
            me.finish = resolve
        })
    }

    Tabcontrol.prototype.closable = function (value) {
        const me = this
        if (value === undefined) {
           return me._closable
        }
        me._closable = (value == 'true');
        if(me._closable) me.dom.classList.add('close')
        return me
    }
}