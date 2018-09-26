{
    const Treegrid = sq.newComponent('samples:treegrid');


    Treegrid.prototype.init = function () {
        const me = this;

    }

    Treegrid.prototype.load = function () {
        const me = this;


        let col = {
            count: {
                name: "Count"
            },
            isMaster: {
                name: "Has Master",
                width: 5
            }
        }

        let dat = [{
            name: "Hello",
            text: "Hello",
            expandable: true,
            type: "file",
            count: 20,
            isMaster: false,
            children: [{
                name: "Hi2",
                text: "Hi2",
                expandable: true,
                count: 25,
                isMaster: true
            }]
        },
        {
            name: "Hi",
            text: "Hi",
            expandable: true,
            count: 25,
            isMaster: true
        }]

        let precol = me.dom.querySelector('[title="Columns:"] pre')
        let prerow = me.dom.querySelector('[title="Data:"] pre')
        precol.textContent = JSON.stringify(col, null, "\t")
        prerow.textContent = JSON.stringify(dat, null, "\t")

        me.dom.querySelector('button')
            .addEventListener('click',()=>{
                let json = {}
                let tree = me.child('treegrid', 'tree')
                let col = precol.textContent
                let dat = prerow.textContent
                json.columns = JSON.parse(col)
                json.data = JSON.parse(dat)
                console.log(json)
                tree.clear()
                tree.bind(json)
        })
    }

}