{
    class Squid {
        constructor() {
            const me = this
        }
        ajax(ajax) {
            var ajax0 = {
                "url": '',
                'callback': null,
                'method': 'POST',
                'data': null,
                'async': true,
            };
            ajax0 = sq.mergeObjects(ajax0, ajax);
            if (!ajax0.url) return null;
            var promise = new Promise(
                function (resolve, reject) {
                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.onreadystatechange = function () {
                        if (xmlhttp.readyState == 4) {
                            if (xmlhttp.status == 200) {
                                if (ajax0.callback) ajax0.callback(xmlhttp.responseText);
                                resolve(xmlhttp.responseText);
                            } else {
                                reject('SQUID_CANNOT_CONNECT_TO_SERVER');
                            }
                        }
                    }
                    xmlhttp.open(ajax0.method, ajax0.url, ajax0.async);
                    if (ajax0.contentType) {
                        xmlhttp.setRequestHeader("Content-Type", ajax0.contentType);
                    };
                    xmlhttp.onerror = function () {
                        reject(Error("Network Error"));
                    };
                    xmlhttp.send(ajax0.data);
                }
            );
            return promise;
        }
        query(url, query, options) {
            let me = this;

            if (!url) {
                url = query.connection.serviceUrl;
                delete query.connection.serviceUrl;
            }

            let ajax0 = {
                "url": url,
                "data": JSON.stringify(query),
                'contentType': "application/json; charset=utf8"
            };
            let getAjax = sq.ajax(ajax0)
            return new Promise(function (resolve, reject) {
                getAjax.then(function (response) {
                    let data = JSON.parse(response);
                    sq.resolveReferences(data, data.data);
                    resolve(data);
                })
                getAjax.then(function (err) {
                    return reject(err);
                })
            });
        }
        resolveReferences(rootData, data, keys) {
            for (var key in data) {
                if (keys != null && !keys.includes(key)) continue;
                var value = data[key];
                if (typeof value == "string" && value.startsWith("$\\")) {
                    var obj = rootData.records;
                    var paths = value.split("\\");
                    var ctr;
                    for (ctr = 1; ctr < paths.length; ctr++) { // ctr =1 (skip $)
                        obj = obj[paths[ctr]];
                    }
                    data[key] = obj ? obj : paths[ctr - 1]; //else not loaded??
                };
                value = data[key];
                if (typeof value == "object") {
                    sq.resolveReferences(rootData, value);
                }
            }
            return;
        }
        get(url, data = {}) {
            const me = this;

            let ajax0 = {
                "url": url,
                'method': 'GET',
                'data': JSON.stringify(data),
            };

            let getAjax = sq.ajax(ajax0)
            return new Promise(function (resolve, reject) {
                getAjax.then(function (response) {
                    return resolve(response);
                })
                getAjax.then(function (err) {
                    return reject(err);
                })
            });
        }
        post(url, data) {
            const me = this;

            let ajax0 = {
                "url": url,
                'method': 'POST',
                'data': JSON.stringify(data),
                'contentType': "application/json;charset=utf-8"
            };

            let getAjax = sq.ajax(ajax0)
            return new Promise(function (resolve, reject) {
                getAjax.then(function (response) {
                    if (typeof response === 'string' || response instanceof String) return resolve(JSON.parse(response));
                    return resolve(response);
                })
                getAjax.then(function (err) {
                    return reject(err);
                })
            });
        }
        observeMutations(target, callback, config = {}) {
            var config0 = {
                attributes: true,
                childList: false
            }
            config0 = sq.mergeObjects(config0, config)
            var observer = new MutationObserver(function (mutations) {
                mutations.forEach(callback);
            });

            observer.observe(target, config0);
            return observer;
        }
        mergeObjects(target, source) {
            let output = Object.assign({}, target);
            if (sq.isObject(target) && sq.isObject(source)) {
                Object.keys(source).forEach(key => {
                    if (sq.isObject(source[key])) {
                        if (!(key in target))
                            Object.assign(output, {
                                [key]: source[key]
                            });
                        else
                            output[key] = sq.mergeObjects(target[key], source[key]);
                    } else {
                        Object.assign(output, {
                            [key]: source[key]
                        });
                    }
                });
            }
            return output;
        }
        isObject(item) {
            return (item && typeof item === 'object' && !Array.isArray(item) && item !== null);
        }
        compareObjects (obj1, obj2) {
            if (!sq.isObject(obj2)) return (obj1 == obj2)
            if (!sq.isObject(obj1)) return false
            let ks2 = Object.keys(obj2) 
            if(!ks2.length && !Object.keys(obj1).length) return true
            let stack = []
            ks2.forEach((k) => {
               stack.push(sq.compareObjects(obj1[k], obj2[k]))
            })
            return stack.every((a)=>{return a})
        }
    }

    self.sq = new Squid()

   
}