{
    let baseUrl = document.scripts['sq-bind'].src.split('bind.js')[0]
    const bindorc = Orc.create(baseUrl + 'bind-worker.js')

    sq.controllers.bind = class Bind extends sq.Controller {
        constructor(dom, key) {
            super(dom, key, 'bind')
            const me = this
            me.orc = bindorc
            me.context = me.dom.sq.controllers.context
            me.counter = 0
            me.uid = Orc.uid()
            me.bind = () => {
                return me.dom.getAttribute('sq-bind')
            }
            me.sets = ()=>{return me.checkAttribute('sets')}
            me.gets = ()=>{return me.checkAttribute('gets')}

            me.listenToWorker(me)
            me.observeSelf(me)
        }
        checkAttribute(attr){
            let a = this.dom.getAttribute('sq-bind-'+attr)
            if (!a || a.toLowerCase() == 'true') return false
            return true
        }
        listenToWorker() {
            const me = this
            me.orc.on('updateData', function (response) {
                if (me.uid == response.uid) return
                if (me.gets()) return
                if (me.bind() != response.contextid) return
                sq.setData(me.dom, response.data)
                
            })
        }
        updateData (){
            const me = this
            let data = sq.getData(me.dom)
            let mssg = {
                'contextid': me.bind(),
                'data': data,
                'uid': me.uid
            }
            me.orc.post('updateData', [mssg])
        }
        observeSelf() {
            const me = this
            sq.observeMutations(me.dom, function (mutation) {
                if (me.checkMutation(mutation) || me.sets()) return
                me.counter += 1
                me.context.ready.then(() => {
                    me.counter -= 1
                    if (me.counter) return
                    me.updateData()
                   
                })
            }, {
                subtree: true
            })
        }
        checkMutation(mutation) {
            let arr = mutation.attributeName.split('sq-')
            if ((arr.length == 2) && (arr[0] == '')) return true
            return false
        }

    }


}