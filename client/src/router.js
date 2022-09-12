import Vue from 'vue'
import Router from 'vue-router'
//Base
import layout from './views/layout/Layout'
import store from "./store"
import CoreEngine from "@/core/CoreEngine";

Vue.use(Router);

const PM = Vue.prototype.PM;

const routes = [
    {
        path: '/',
        redirect: '/index',
        hidden: true
    },
    {
        path: '*',
        redirect: '/404',
        hidden: true
    },
    {
        path: '/login',
        meta: {key: ""},
        component: () => import('@/views/login/login'),
        name: '登录',
        hidden: true
    },
    {
        path: '/404',
        component: layout,
        name: '',
        hidden: true,
        children: [
            {path: '/404', component: () => import('@/views/404'), hidden: true, name: 404, meta: {key: ""}}
        ]
    },
    {
        path: '/403',
        component: layout,
        name: '',
        hidden: true,
        children: [
            {path: '/403', component: () => import('@/views/403'), hidden: true, name: 403, meta: {key: ""}}
        ]
    },
    {
        path: '/',
        component: layout,
        meta: {icon: 'el-icon-s-home'},
        children: [
            {path: '/index', component: () => import('@/views/index/index'), name: '首页', meta: {key: PM.IndexView}}
        ]
    },
    {
        path: '/artifact',
        component: layout,
        meta: {icon: 'el-icon-s-home'},
        children: [
            {path: '/artifact', component: () => import('@/views/index/artifact'), name: '圣遗物录入', meta: {key: PM.IndexView}}
        ]
    },
    {
        path: '/system',
        component: layout,
        name: '系统管理',
        meta: {icon: 'el-icon-s-tools'},
        children: [
            {path: '/system/permission', component: () => import('@/views/system/permission'), name: '权限管理', meta: {key: PM.SystemUserEdit}},
        ]
    },
];

let router = new Router({
    mode: 'history',
    routes
});

const transitionTo = router.history.transitionTo
router.history.transitionTo = function (location, onComplete) {
    transitionTo.call(this, location, onComplete, () => {
        let route = router.match(location, router.history.current);
        router.history.updateRoute(route);
        //if (onComplete) onComplete(route);
    });
}

router.beforeEach(async (to, from, next) => {
    window.document.title = '系统-' + to.name;
    await CoreEngine.init();
    let key = to.meta.key;
    if (key === "") {
        next();
    } else {
        let vm = Vue.prototype;
        let my = store.getters.user;
        if (!my) {
            let res = await vm.$api("User/GetMineInfo");
            if (res instanceof Error) return;
            await store.dispatch('user/setUser', res.user)
            await store.dispatch('user/setPermissions', res.permissions)
        }
        let permissions = store.getters.permissions;
        if (!permissions[key]) {
            router.push({path: '/403'})
        } else {
            next()
        }
    }
});

export default router
