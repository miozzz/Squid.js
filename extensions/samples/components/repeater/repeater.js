{
    const Repeater = sq.newComponent('samples:repeater');

    Repeater.prototype.load = function () {
        const me = this;

        let data1 = 
        { 
                A: {
                    name: "John",
                    lastname: "Lazatin",
                    Numbers: {
                        "Michael": "09992288946",
                        "Germie": "09189964567",
                        "Joseph": "099912388946"
                    }
                },
                B: {
                    name: "Germie",
                    lastname: "Cabauatan",
                    Numbers: {
                        "Sabrina": "09228134322",
                        "Danica": "09992232946",
                        "Joseph": "099912388946"
                    }
                },
                C: {
                    name: "Danica",
                    lastname: "Fernandez",
                    Numbers: {
                        "Michael": "09992288946",
                        "Sabrina": "09228134322",
                        "Joseph": "099912388946"
                    }
                },
                D: {
                    name: "Ahlrenz",
                    lastname: "Banes",
                    Numbers: {
                        "Danica": "09992232946",
                        "Sabrina": "09228134322",
                        "Germie": "09189964567"
                    }
                },
                E: {
                    name: "Billy Noel",
                    lastname: "Tapales",
                    Numbers: {
                        "Germie": "09189964567",
                        "Joseph": "099912388946",
                        "Sabrina": "09228134322"
                    }
                }
            

        }

        let codearea = me.dom.querySelector('[title="Data:"]').sq
        codearea.value(data1)
        let bttn = me.dom.querySelector('button')
        let repeater = me.dom.querySelector('[sq-repeat=contacts]')
        //sq.setData(codearea.dom, data1)

        bttn.addEventListener('click', () => {
            let dat = sq.getData(codearea.dom)
            console.log(dat)
            sq.setData(repeater, dat)
        })
    }

}