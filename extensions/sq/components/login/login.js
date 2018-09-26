{
    const Login = sq.newComponent('sq:Login');

    Login.prototype.init = function () {
        const me = this;
        me.addEvent('authenticate');
        me.addEvent('resetrequest');
    }

    Login.prototype.load = function () {
        const me = this;

        me.logform = me.dom.querySelector('form');
        me.forgotform = me.dom.querySelector('form[sq-context=forgotinfo]');
        let forgotbtn = me.dom.querySelector('[name=forgotpass]');

        clearFields.call(me)

        me.logform.addEventListener('submit', function (e) {
            e.preventDefault();
            let logData = {
                credentials: sq.getData(me.logform).credentials,
                keep: me.dom.querySelector('[name=keep]').checked
            }
            me.trigger('authenticate', logData)
        });

        me.forgotform.addEventListener('submit', function (e) {
            e.preventDefault();
            let resetData = sq.getData(me.forgotform).forgotinfo
            me.trigger('resetrequest', resetData)
        });

        forgotbtn.addEventListener('click', function (e) {
            clearFields.call(me)
            if(me.dom.classList.contains('forgot')) {
                me.dom.classList.remove('forgot')
                forgotbtn.textContent = 'Forgot Password?'
            }
            else {
                me.dom.classList.add('forgot')
                forgotbtn.textContent = 'Back to login'
            }
        });
    }

    let clearFields = function() {
        const me = this
        sq.setData(me.logform, {
            credentials: {
                username: '',
                password: ''
            }
        });

        sq.setData(me.forgotform, {
            forgotinfo: {
                username: '',
                email: ''
            }
        });
    }

    Login.prototype.title = function (value) {
        const me = this
        if (value === undefined) {
            return document.title
        }
        document.title = value;
        return me
    }

    Login.prototype.subtitle = function (value) {
        const me = this
        if (value === undefined) {
            return me.dom.querySelector('[name=app]').textContent
        }
        me.dom.querySelector('[name=app]').textContent = value
        return me
    }

    Login.prototype.image = function (value) {
        const me = this
        if (value === undefined) {
            return me.dom.querySelector('[name=appimg]').src
        }
        me.dom.querySelector('[name=appimg]').src = value;
        return me
    }

}