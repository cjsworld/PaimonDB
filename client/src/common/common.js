import Vue from 'vue'

Vue.prototype.$hasPM = function (key) {
    return this.$store.getters.permissions[key] === 1
}

Vue.prototype.$timestamp = function () {
    let time = Date.parse(new Date())
    return time / 1000
}

Vue.prototype.$contains = function (array, needle) {
    for (let i in array) {
        if (!array.hasOwnProperty(i)) continue
        if (array[i] === needle) return true
    }
    return false
}

Vue.prototype.$isInt = function (val) {
    let reg = /^-?\d+$/
    return reg.test(val)
}

Vue.prototype.$isFloat = function (val) {
    let reg = /^(-?\d+)(\.\d+)?$/ // 非负浮点数
    return reg.test(val)
}

Vue.prototype.$isEmpty = function (v) {
    if (v === undefined || v === null || v === "") return true
    if (typeof v === 'object') {
        for (let i in v) {
            if (v.hasOwnProperty(i)) {
                return false;
            }
        }
        return true;
    } else {
        return v === 'undefined' || v === 'null'
    }
}

Vue.prototype.$formatIntArr = function (arr) {
    let t = []
    for (let i = 0, len = arr.length; i < len; i++) {
        t.push(parseInt(arr[i]))
    }
    return t
}

Vue.prototype.$formatIntValue = function (v, def = undefined) {
    if (Vue.prototype.$isEmpty(v)) {
        return def
    } else if (Vue.prototype.$isInt(v)) {
        return parseInt(v)
    } else {
        return def
    }
}

Vue.prototype.$formatIntObj = function (obj, keys) {
    if (!keys) return
    for (let k in keys) {
        if (!keys.hasOwnProperty(k)) continue
        let key = keys[k]
        obj[key] = Vue.prototype.$formatIntValue(obj[key])
    }
}

Vue.prototype.$formatFloatValue = function (v, def = undefined) {
    if (Vue.prototype.$isEmpty(v)) {
        return def
    } else if (Vue.prototype.$isFloat(v)) {
        return parseFloat(v)
    } else {
        return def
    }
}

Vue.prototype.$formatFloatObj = function (obj, keys) {
    if (!keys) return
    for (let k in keys) {
        if (!keys.hasOwnProperty(k)) continue
        let key = keys[k]
        obj[key] = Vue.prototype.$formatFloatValue(obj[key])
    }
}

Vue.prototype.$formatBoolValue = function (v, def = undefined) {
    if (Vue.prototype.$isEmpty(v)) {
        return def
    } else if (v === 'true') {
        return true
    } else if (v === 'false') {
        return false
    } else {
        return def
    }
}

Vue.prototype.$clearObj = function (obj) {
    for (let s in obj) {
        if (!obj.hasOwnProperty(s)) continue
        obj[s] = null
    }
}

Vue.prototype.$rest = function () {
    this.$router.push({
        path: this.$route.path,
        query: {}
    })
}

Vue.prototype.$validatorNumber = (rule, value, callback) => {
    if (!value) {
        return callback(new Error('不能为空'));
    }
    if (!Vue.prototype.$isInt(value)) {
        return callback(new Error('请输入数字值'));
    } else {
        if (value <= 0) {
            return callback(new Error('请输入正数'));
        }
        return callback();
    }
};

Vue.prototype.$formatTime = function (time) {
    if (!time) return ''
    let date = new Date(time * 1000)
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    m = m < 10 ? ('0' + m) : m
    let d = date.getDate()
    d = d < 10 ? ('0' + d) : d
    let h = date.getHours()
    h = h < 10 ? ('0' + h) : h
    let minute = date.getMinutes()
    let second = date.getSeconds()
    minute = minute < 10 ? ('0' + minute) : minute
    second = second < 10 ? ('0' + second) : second
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
}

Vue.prototype.$formatDate = function (time) {
    if (!time) return ''
    let date = new Date(time * 1000)
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    m = m < 10 ? ('0' + m) : m
    let d = date.getDate()
    d = d < 10 ? ('0' + d) : d
    return y + '-' + m + '-' + d
}

Vue.prototype.$formatTimeXs = function (time) {
    if (!time) return ''
    let date = new Date(time * 1000)
    let m = date.getMonth() + 1
    m = m < 10 ? ('0' + m) : m
    let d = date.getDate()
    d = d < 10 ? ('0' + d) : d
    let h = date.getHours()
    h = h < 10 ? ('0' + h) : h
    let minute = date.getMinutes()
    minute = minute < 10 ? ('0' + minute) : minute
    return m + '/' + d + ' ' + h + ':' + minute
}

Vue.prototype.$formatMonth = function (time) {
    if (!time) return ''
    let date = new Date(time * 1000)
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    m = m < 10 ? ('0' + m) : m
    return y + '-' + m
}
