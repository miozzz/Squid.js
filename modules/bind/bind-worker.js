importScripts('/squidworkerbundle.js');
importScripts('/modules/orc/orc.js');


self.cache = {}
orc.updateData = function ([data]) {
    if (checkCache(data.contextid, data.data)) {
        updateCache(data.contextid, data.data)

        return data
    }
    updateCache(data.contextid, data.data)
    return null
}

self.checkCache = function (contextid, data) {
    let a = JSON.stringify(data)
    let b = JSON.stringify(cache[contextid])
    return !sq.compareObjects(a,b)
}
self.updateCache = function (id, data) {
    cache[id] = data
}

