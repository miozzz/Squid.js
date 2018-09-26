{ 
    const Form = sq.newComponent('sq:form');

    Form.prototype.load = function () {
        const me = this;
        let data = {
            "fields": {
                "name": {
                    "label": "Name",
                    "type": "text"
                },
                "birthdate": {
                    "label": "Birthdate",
                    "type": "date"
                },
                "gender": {
                    "label": "Gender",
                    "type": "select",
                    "option": {
                        "male": "Male",
                        "female": "Female"
                    }
                },
                "country": {
                    "label": "Country",
                    "type": "select"
                },
                "genre": {
                    "label": "Genre",
                    "type": "checkbox"
                },
                "age": {
                    "label": "Age",
                    "type": "number"
                },
            }
        }

        let getter = me.dom
        sq.setData(getter,data)
    }

    Form.prototype.getData = function(){
        const me = this
        let data = sq.getData(me.dom)
        let ret = {}
        Object.keys(data.fields)
        .forEach((k)=>{
            ret[k] = data.fields[k].value
        })
        return ret
    }
    
}