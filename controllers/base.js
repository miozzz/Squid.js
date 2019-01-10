
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