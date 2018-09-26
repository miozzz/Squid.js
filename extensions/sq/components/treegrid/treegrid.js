{
    const Treegrid = sq.newComponent('sq:treegrid');

    Treegrid.prototype.init = function () {
        const me = this;

        me.addEvents(["populate", "selected", "rowadded"]);
        me.rowController = function (bind) { return bind; }
        me.rowId = 0;
        me.columns = null;
        me.data = function (value) {
            const me = this;
            try { me.bind(JSON.parse(value)); }
            catch (err) { }
        }
    }

    Treegrid.prototype.load = function () {
        const me = this
     
        let selectable = me.dom.querySelector('tbody').sq.controllers.selectable
        me.clear();

        selectable.on("selected", function (e) {
            me.trigger('selected', e);
        });

        me.dom.addEventListener('keydown', function (event) {
            let keycode = (event.keyCode ? event.keyCode : event.which)
            let item = selectable.selected()
            switch (keycode) {
                case 38: //up
                    if (!item) break
                    selectable.selectPrevious()
                    event.preventDefault()
                    break
                case 40: //down
                    if (!item) break
                    selectable.selectNext()
                    event.preventDefault()
                    break
                case 37:  //left
                    if (!item) break
                    let row = item.sq
                    if (row.state == 'expanded'
                        && row.collapse()) {
                        event.preventDefault()
                    } else {
                        if (row.parentid()) break
                        let parent = me.getRow('[data-parentid="' + row.parentid() + '"]')
                        if (parent) parent.collapse()
                        event.preventDefault();
                    }
                    break;
                case 39: //right
                    if (!item) break
                    let crow = item.sq
                    if (crow.state == 'collapsed'
                        && crow.expand()) {
                        event.preventDefault()
                    } else {
                        if (crow.parentid()) break
                        let cparent = me.getRow('[data-id="' + crow.id() + '"]')
                        if (cparent) cparent.expand()
                        event.preventDefault();
                    }
                default:
                    break;
            }
        });

        me.on("populate", function (e) {
            if (e.row.children) {
                var json = {};
                json.row = e.row;
                json.data = e.row.children;
                me.populate(json);
                return me;
            }
        });

    }
    parseJson = function(json){
        if(typeof json == "string") {
            try{ json = JSON.parse(json) }
            catch (err) { return null}
        }
        return json
    }
    Treegrid.prototype.bind = function (json) {
        const me = this;
        
        json = parseJson(json)
        me.clearColumns();
        me.loadColumns(json.columns)

        me.populate(json);

    }
    Treegrid.prototype.loadColumns = function(columns){
        const me = this;
        me.columns = sq.mergeObjects(me.columns, columns);
        for (var name in me.columns) {
            me.addColumn(name, me.columns[name])
        }
        return me
    }

    Treegrid.prototype.populate = function (json) {
        const me = this;
        json = parseJson(json)
        if(!json) return
        if (!Array.isArray(json.data)) return me.bindJson(json.data,json.row);
        return json.data.map(function (item) {
            const ctrl = me.addRow(item, json.row);
            ctrl.onclick = function () {
                me.trigger("selected", { "row": ctrl });
            }
            me.trigger("rowadded", { "row": ctrl });
            return ctrl;
        });

    }

    Treegrid.prototype.bindJson = function (json, row) {
        const me = this;
        const array = []
        for (var item in json) {
            const ctrl = me.addRow(json[item], row,item);
            ctrl.onclick = function () {
                me.trigger("selected", { "row": ctrl });
            }
            me.trigger("rowadded", { "row": ctrl });
            array.push(ctrl);
        }
        return array;
    }

    Treegrid.prototype.clear = function () {
        this.clearColumns();
        this.clearRows();
    }

    Treegrid.prototype.clearColumns = function () {
        this.columns = {
            "expander": { hide: true },
            "image": { hide: true },
            "text": { hide:true }
        };
        this.dom.querySelector('thead > tr').innerHTML = '';
        return this;
    }

    Treegrid.prototype.clearRows = function () {
        this.dom.querySelector('tbody').innerHTML = '';
        return this;
    }

    Treegrid.prototype.addRow = function (item, row, key) {
        const me = this;
        const data = me.rowController(item,key);
        data.parent = row;
        data.rowid = me.rowId++;

        const tr = document.createElement('tr');
        let next
        if(!row) next = null
        else next = row.dom.nextSibling
        tr.setAttribute('name',key)
        me.dom.querySelector('tbody').insertBefore(tr, next);
        return new me.row(tr, data);
    }

    Treegrid.prototype.addColumn = function (key, option) {
        const me = this;
        const th = document.createElement('th');
        if (option === undefined) option = {};
        if (option.name === undefined && !option.hide) option.name = key;
        th.textContent = option.name;
        th.setAttribute('name', key);
        if (option.width) th.setAttribute('colspan', option.width);
        me.dom.querySelector('thead > tr').appendChild(th);
        me.columns[key] = option;
        return me;
    }

    Treegrid.prototype.getRow = function (selector) {
        let me = this;
        let s = 'tr' + (selector ? selector : '');
        if (!me.dom.querySelector(s)) return null
        return me.dom.querySelector(s).sq
    }

    Treegrid.prototype.row = class row {

        constructor(dom, data) {
            const me = this;
            me.dom = dom;
            me.state = "collapsed";
            me.data = data;
            me.isPopulate = false;
            me.expander = null;
            me.tree = null;
            me.children = null;

            me.id = function (value) {
                if (value === undefined) return me.dom.getAttribute('data-id');
                me.dom.setAttribute('data-id', value);
                return me;
            }

            me.parentid = function (value) {
                if (value === undefined) return me.dom.getAttribute('data-parentid');
                me.dom.setAttribute('data-parentid', value);
                return me;
            }

            me.name = function (value) {
                if (value === undefined) return me.dom.getAttribute('data-name');
                me.dom.setAttribute('data-name', value);
                return me;
            }

            me.level = function (value) {
                if (value === undefined) return me.dom.getAttribute('data-level');
                me.dom.setAttribute('data-level', value);
                return me;
            }

            me.expandable = function (value) {
                if (value === undefined) return me.dom.getAttribute('data-expandable');
                me.dom.setAttribute('data-expandable', value);
                return me;
            }

            me.getTree = function () {
                while ((dom = dom.parentElement) && !dom.classList.contains("treegrid"));
                return me.tree = dom.sq;
            }

            dom.sq = this;
            return me.bind(me, data);

        }

        updateImage(value) {
            const me = this;

            if (value === undefined) return me.state;
            me.expander.src = `images/${value}.svg`;
            return me.state = value;
        }

        selectChildren() {
            const me = this; const ret = [];
            const dom = me.tree.dom.querySelector('tbody');
            const sel = 'tr[data-parentid="' + me.id() + '"]';

            if (!dom.children) return ret;

            for (var i = 0; i < dom.children.length; i++) {
                var child = dom.children[i];
                if (child.matches(sel)) ret.push(child);
            }
            return ret;
        }

        removeChildren() {
            const me = this;
            me.selectChildren()
                .forEach(function (child) {
                    child.sq.remove();
                });
        }

        remove() {
            const me = this;
            me.removeChildren();
            me.dom.remove();
        }

        toggle() {
            const me = this;
            if (me.state == 'collapsed')
                me.expand();
            else me.collapse();
        }

        expand() {
            const me = this;
            if (!me.expandable) return false;
            if (!me.isPopulate) {
                me.tree.trigger('populate', { "row": me });
                me.isPopulate = true;
            }

            const trs = me.selectChildren();
            for (var ctr = 0; ctr < trs.length; ctr++) {
                trs[ctr].classList.remove('hidden');
            }

            me.updateImage('expanded');
            return true;
        }

        collapse() {
            const me = this;
            if (!me.expandable) return false;

            const trs = me.selectChildren();
            for (var ctr = 0; ctr < trs.length; ctr++) {
                var row = trs[ctr];
                row.sq.collapse();
                row.classList.add('hidden');
            }

            me.updateImage('collapsed');
            return true;
        }

        bind(control, data) {
            var level = 1;
           
            if (data.parent) {
                control.parentid(data.parent.dom.getAttribute('data-id'));
                level = parseInt(data.parent.level()) + 1;
            }

            control
                .level(level)
                .id(data.rowid)
                .expandable(data.expandable? data.expandable:false)
                .children = data.children;

            for (var col in control.getTree().columns) {

                const td = document.createElement('td');
                td.setAttribute('name', col);
                control.dom.appendChild(td);

                switch (col) {
                    case 'expander':
                        td.setAttribute('colspan', control.level());
                        control.expander = document.createElement('img');
                        control.updateImage('collapsed');
                        if (data.expandable) {
                            td.appendChild(control.expander);
                            control.expander.onclick = function () {
                                control.toggle();
                            }
                        }
                        break;
                    case 'image':
                        const image = document.createElement('img');
                        if (!data.image) {
                            if (!data.type) data.type = 'folder';
                            data.image = `images/${data.type}.svg`;
                        }
                        image.setAttribute('src', data.image);
                        td.appendChild(image);
                        break;
                    case 'text':
                        td.textContent = data.text;
                        td.setAttribute('colspan', 32 - 1 - control.level());
                        break;
                    default:
                        if (data[col] && data[col].nodeType)
                            td.appendChild(data[col])
                        else {
                            td.innerHTML = data[col]
                            td.setAttribute('data-value', data[col])
                        }
                            

                }

            }

            control.dom.classList.add("row");
            return control;
        }

    }

}