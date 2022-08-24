import axios from 'axios'
import {Message} from 'element-ui'
import router from './router'
import NP from 'nprogress'

let np = NP;
np.configure({showSpinner: false});

let source;

export default async (a, p = {}, cancel = false, showNp = true) => {
    axios.defaults.headers['Content-Type'] = 'application/json';
    if (showNp) {
        np.start();
    }
    if (cancel) {
        if (source) source.cancel('cancel');
        source = axios.CancelToken.source();
    }
    let url = "/api/" + a;
    let config = (cancel && source) ? {cancelToken: source.token} : null;
    let promise;
    if (Object.keys(p).length === 0) {
        promise = axios.get(url, config)
    } else {
        promise = axios.post(url, p, config)
    }
    let response = await promise.catch(function (error) {
        if (showNp) {
            np.done();
        }
        if (error.message === 'cancel') return Error("cancel");
        if (error.response.status === 500) {
            let msg = error.message + " " + error.response.data
            Message({
                type: 'error',
                message: msg
            });
            return Error(msg)
        }
        if (error.response.status === 401) {
            let path = window.location.pathname + window.location.search;
            router.replace({path: '/login', query: {target: path}});
            return Error('Need Login')
        }
        if (error.response.status === 404) {
            let msg = `接口 ${a} 不存在！`
            Message({
                type: 'error',
                message: msg
            });
            return Error(msg)
        }
        if (error.message === 'Network Error') {
            Message({
                type: 'error',
                message: '网络连接失败'
            });
            return Error('Network Error')
        } else {
            if (error.response) {
                return error.response
            } else {
                return Error("error")
            }
        }
    });
    if (!response || response instanceof Error) return response //error
    if (showNp) {
        np.done();
    }
    let d = response.data;
    if (typeof(d) !== 'object') {
        let msg = `接口 ${a} 格式错误！`
        Message({
            type: 'error',
            message: msg
        });
        return Error(msg)
    }
    if (d.hasOwnProperty("E")) {
        let error = d.E;
        Message({
            type: 'error',
            message: error
        });
        return Error(error);
    } else {
        return d.P;
    }
}
