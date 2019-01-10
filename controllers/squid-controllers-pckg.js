window.squid = {
    controllers:{
        __registry__:[]
    },
    parser :{ 
        dashToCamelCase: (str)=> {
            let ar = str.split('-')
            for (let i = 1; i < ar.length; i++) ar[i] = squid.parser.capitalize(ar[i])
            return ar.join('')
        },
        camelCaseToDash: (str)=> {
            return str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase()
        }
    },
    
    attachContext : function (dom){
        const key = dom.getAttribute("sq-context")
        return new Context(dom,key)
    },

    mergeObjects : function (target, source) {
        let output = Object.assign({}, target);
        if (squid.isObject(target) && squid.isObject(source)) {
            Object.keys(source).forEach(key => {
                if (squid.isObject(source[key])) {
                    if (!(key in target))
                        Object.assign(output, {
                            [key]: source[key]
                        });
                    else
                        output[key] = squid.mergeObjects(target[key], source[key]);
                } else {
                    Object.assign(output, {
                        [key]: source[key]
                    });
                }
            });
        }
        return output;
    },
    isObject : function (item) {
        return (item && typeof item === 'object' && !Array.isArray(item) && item !== null);
    },
    compareObjects : function (obj1, obj2) {
        if (!squid.isObject(obj2)) return (obj1 == obj2)
        if (!squid.isObject(obj1)) return false
        let ks2 = Object.keys(obj2)
        if (!ks2.length && !Object.keys(obj1).length) return true
        let stack = []
        ks2.forEach((k) => {
            stack.push(squid.compareObjects(obj1[k], obj2[k]))
        })
        return stack.every((a) => { return a })
    }


}

class Controller {
    constructor(dom, key, controllerName) {
        const me = this
        me.dom = dom
        me.addControllerObject(me, controllerName)
        if (!me.dom.sq.controllers.__registeryid__) me.dom.sq.controllers.__registeryid__ = []
        me.__registeryid__ = me.registerController(me)

    }
    get __registeryid__() {
        return this.dom.sq.controllers.__registeryid__.join(':')
    }
    set __registeryid__(val) {
        this.dom.sq.controllers.__registeryid__.push(this.registerController(this))
    }
    addControllerObject(me, controlName) {
        if (!me.dom.sq) {
            me.dom.sq = {}
            me.dom.sq.controllers = {}
        }
        me.dom.sq.controllers[controlName] = me
    }
    registerController(controller) {
        squid.controllers.__registry__.push(controller)
        return squid.controllers.__registry__.length - 1
    }
}

class Context extends Controller {
    constructor(dom, key) {
        super(dom, key, 'context')
        const me = this
        me.__context__ = function () {
            return me.dom.getAttribute('sq-context')
        }
        me.ready = new Promise((resolve, reject) => { resolve() })
        me.__data__ = {}
        me.__slmap__ = new Map()
        me.__sqmap__ = new Map()
        me.__txtnd__ = new Map()
        if (key) dom.setAttribute('sq-context', key)
        me.setMap(me.dom)
        return me
    }

    setMap(dom) {
        const me = this
        let attrs = me.getAttributesWithData(dom)
        if (Object.keys(attrs).length) me.__slmap__.set(dom, attrs)
        if (dom.tagName == "INPUT") {
            dom.addEventListener('keyup', (e) => {
                dom.setAttribute('value', e.target.value)
            })
        }

        me.convertTextNodes(dom);
        me.getTextNodes(dom);
        let children = [].slice.call(dom.children)
        children.forEach(function (child) {
            let ck = child.getAttribute('sq-context')
            if (child.hasAttribute('sq-repeat')) {
                ck = child.getAttribute('sq-repeat')
                let attrs = me.getAttributesWithData(child)
                if (Object.keys(attrs).length) me.__slmap__.set(child, attrs)
            }
            if (ck) return me.addChild(child, ck)

            me.setMap(child)
        })

    }
    addChild(child, ck) {
        const me = this
        if (child.hasAttribute('sq-set')) return
        me.__sqmap__.set(child, ck)
    }

    getAttributesWithData(node) {
        let obj = {}
        let attrs = document.evaluate("attribute::*[contains(., '${')]", node, null, XPathResult.ANY_TYPE, null)
        let attr = attrs.iterateNext()
        while (attr) {
            if (attr.value.includes('${')) obj[attr.name] = attr.value
            attr = attrs.iterateNext()
        }
        return obj
    }

    convertTextNodes(node) {
        let children = [].slice.call(node.childNodes);
        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeType == 3) {
                if (children[i].data.match(/\${.\w.+}/g)) {
                    let node = children[i].parentElement
                    if (!node.classList.contains('sl')) {
                        node.innerHTML = node.childNodes[0].nodeValue
                            .replace(/(\${)(.*?)(\})/g, function (m) {
                                return '<span class="sl">' + m + '</span>'
                            })
                    }
                }
            }
        }
    }

    getTextNodes(node) {
        let children = [].slice.call(node.childNodes);
        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeType == 3) {
                if (children[i].data.match(/\${.\w.+}/g)) {
                    this.__txtnd__.set(children[i], children[i].data)
                    children[i].data = '';
                }
            }
        }
    }

    setData(params) {
        const me = this
        me.ready = new Promise((resolve, reject) => {
            me.setDataCore(params)
            resolve()
        })
        return me.ready
    }
    setDataCore({ data, flags }) {
        const me = this
        if (flags && !me.checkFlags(flags)) return data
        // console.log('passflags')
        let key;
        if (me.dom.hasAttribute('sq-context'))
            key = me.dom.getAttribute('sq-context')
        if (data[key] && data[key].nodeType) me.__data__ = data[key]
        else me.__data__ = squid.mergeObjects(me.__data__, data[key])

        me.__sqmap__.forEach(function (val, newDom) {
            let dataControl = newDom.sq.controllers.context
            dataControl.setData({"data":me.__data__})
        })

        me.__txtnd__.forEach(function (value, dom) {
            dom.data = me.setValue(dom, value, me.__data__, key, data)
        })

        me.__slmap__.forEach(function (attrs, dom) {
            Object.keys(attrs).forEach(function (attr) {
                let value = me.setValue(dom, attrs[attr], me.__data__, key, data)
                if (dom.sq && dom.sq.dom) { squid.Component.setProperty(dom.sq, attr, value) }
                else {
                    attr = squid.parser.dashToCamelCase(attr)

                    dom[attr] = value
                    dom.setAttribute(squid.parser.camelCaseToDash(attr), value)
                }
            })
        })

    }
    setValue(dom, literal, obj, key, root) {
        const me = this
        let data = root[key]
        let tempLit = me.litVal(literal, obj, data, key, root)
        return eval("`" + tempLit + "`;")
    }
    litVal(literalVal, obj, data, key, root) {
        const me = this
        let spcls = ["@key", "@data", "@root", "@obj", "@window"]
        return literalVal
            .replace(/\${.\w.+}/g, function (lit) {
                let sty = '${JSON.stringify('
                let match = lit.replace(/\${/, '').replace(/}/, '').trim()
                let str = 'obj.' + match + ''
                let isobj = obj[match]
                let isAt = spcls.find(function (cmp) {
                    if (match.startsWith(cmp)) return true
                })
                if (isAt) {
                    str = match.replace('@', '')
                    try {
                        isobj = eval(str)
                    }
                    catch (er) {
                        return undefined
                    }

                }
                return (squid.isObject(isobj) ? sty + str + ')}' : '${ ' + str + ' }')
            })
    }
    iterateOnLit(litArr, callback) {
        if (!litArr) return
        let spcls = ["@key", "@root"]
        let re1 = /\${/
        let re2 = /}/
        litArr.forEach(function (lit) {
            lit = lit.replace(re1, '')
            lit = lit.replace(re2, '')
            if (spcls.includes(lit)) return
            callback(lit)
        })
    }
    getData(dom = this.dom, { data = {}, flags }) {
        const me = this
        let rootData = data
        if (flags && !me.checkFlags(flags)) return rootData
        let key = me.dom.getAttribute('sq-context')
        if (!rootData[key]) rootData[key] = {}
        let re = /\${.\w.+}/g

        me.__slmap__.forEach(function (attrs, dom) {
            let ks = Object.keys(attrs)
            ks.forEach(function (k) {
                let litArr = attrs[k].match(re)
                me.iterateOnLit(litArr, (litStr) => {
                    let data = null
                    if (dom.sq && (typeof dom.sq[k] == 'function')) data = dom.sq[k]()
                    else {
                        let attr = squid.parser.dashToCamelCase(k)
                        data = dom[attr]
                        if (!data) data = dom.getAttribute(attr)
                    }

                    me.switchLit(litStr, data, rootData, key, k)

                })

            })

        })

        me.__txtnd__.forEach(function (value, dom) {
            let litArr = value.match(re)
            let data = dom.textContent.trim()
            me.iterateOnLit(litArr, (litStr) => {
                me.switchLit(litStr, data, rootData, key)
            })

        })

        me.__sqmap__.forEach(function (val, newDom) {
            let dataControl = newDom.sq.controllers.context
            dataControl.getData(newDom, rootData[key])
        })

        return rootData;
    }
    switchLit(litStr, data, rootData, key, k) {
        const me = this;
        const litKeys = litStr.split('.')
        const lit = litKeys[0]
        switch (lit) {
            case '@data':
                rootData[key] = data
                break
            case '@value':
                rootData[key][k] = data
                break
            case '@obj':
                me.buildObj(rootData[key], litKeys, 1, data)
                break
            default:
                me.buildObj(rootData[key], litKeys, 0, data)
                break
        }
    }
    buildObj(rootData, litKeys, i, data) {
        const me = this
        if (i < litKeys.length - 1) {
            if (!rootData[litKeys[i]]) rootData[litKeys[i]] = {}
            let j = i + 1
            return me.buildObj(rootData[litKeys[i]], litKeys, j, data)

        }
        rootData[litKeys[i]] = data
        return rootData
    }
    checkFlags(flags) {
        const me = this
        flags = flags.split(' ')
        if (!me.dom.getAttribute('sq-context-flags')) return false
        let cFlags = me.dom.getAttribute('sq-context-flags').split(' ')
        if (!cFlags.length) return true
        let ret = flags.find(function (flag) {
            return cFlags.includes(flag)
        })
        return ret
    }
}