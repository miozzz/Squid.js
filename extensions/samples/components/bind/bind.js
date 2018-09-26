{
    const Bind = sq.newComponent('samples:bind');

    Bind.prototype.init = function () {
        
    }
    
    Bind.prototype.load = function () {
        const me = this;
        let data = {
            details:{
                name: "John",
                lastname: "Robles",
                contacts:{
                    home: 9319211,
                    mobile: 9228146415
                },
                address: "15 L. Arroyo St. Tandang Bella Subd. Quadrado City"
            }
        }

        let getter = me.dom.querySelector('div[sq-bind]')
        sq.setData(getter,data)
    }



}