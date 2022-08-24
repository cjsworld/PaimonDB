<template>
    <div class="app-wrapper" :class="classObj">
        <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>
        <sidebar class="sidebar-container" :sidebar="sidebar" :route-map="routeMap"></sidebar>
        <div class="main-container">
            <el-menu class="navbar" mode="horizontal">
                <hamburger class="hamburger-container" :toggleClick="toggleSideBar"
                           :isActive="sidebar.opened"></hamburger>
                <div style="float: left">
                    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-top: 17px;">
                        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>{{ $route.name }}</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <div style="float: right;padding-right: 10px">
                    <el-dropdown>
                        <span class="el-dropdown-link">
                            {{ username }}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
                                <span @click="logout" style="display:block;">注销</span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-menu>

            <section class="app-main">
                <transition name="fade" mode="out-in">
                    <router-view></router-view>
                </transition>
            </section>
        </div>
        <el-backtop :right="10"><i class="el-icon-caret-top"></i></el-backtop>
    </div>
</template>

<script>
import Hamburger from '@/components/Hamburger'
import Sidebar from './Sidebar'

export default {
    name: 'Layout',
    components: {
        Hamburger,
        Sidebar,
    },
    beforeMount() {
        window.addEventListener('resize', this.resizeHandler);
        this.device = this.isMobile() ? 'mobile' : 'desktop';
        this.sidebar.opened = localStorage.getItem('sidebarOpened') === 'true';
    },
    data() {
        return {
            device: 'desktop',
            sidebar: {opened: true, withoutAnimation: false},
            routeMap: []
        }
    },
    computed: {
        classObj() {
            return {
                hideSidebar: !this.sidebar.opened,
                openSidebar: this.sidebar.opened,
                withoutAnimation: this.sidebar.withoutAnimation,
                mobile: this.device === 'mobile'
            }
        },
        username() {
            return this.$store.getters.user ? this.$store.getters.user.name : '';
        }
    },
    methods: {
        isMobile() {
            const rect = document.body.getBoundingClientRect();
            return rect.width < rect.height
        },
        resizeHandler() {
            if (!document.hidden) {
                this.device = this.isMobile() ? 'mobile' : 'desktop';
            }
        },
        handleClickOutside() {
            this.sidebar.opened = false;
            localStorage.setItem('sidebarOpened', this.sidebar.opened);
        },
        toggleSideBar() {
            this.sidebar.opened = !this.sidebar.opened;
            localStorage.setItem('sidebarOpened', this.sidebar.opened);
        },
        //退出登录
        async logout() {
            const res = await this.$api("User/Logout");
            if (res instanceof Error) return
            location.replace('/login');
        }
    },
    async created() {
        if (!this.$store.getters.permissions) {
            const res = await this.$api("User/GetMineInfo");
            if (res instanceof Error) return
            await this.$store.dispatch('user/setUser', res.user)
            await this.$store.dispatch('user/setPermissions', res.permissions)
        }
        //更具权限筛选路由
        let permissions = this.$store.getters.permissions;
        let ps = this.$router.options.routes;
        for (let i in ps) {
            if (!ps.hasOwnProperty(i)) {//跳过没有权限的
                continue;
            }
            let cs = ps[i].children;
            if (!cs) {//没有子节点
                let tmp = ps[i];
                let p = tmp.meta ? tmp.meta.key : "";
                let hidden = tmp.hidden ? tmp.hidden : false;
                if (!hidden && permissions[p]) {
                    this.routeMap.push("push2" + tmp);
                }
            } else {
                let child = [];
                for (let j in cs) {
                    if (!cs.hasOwnProperty(j)) continue;
                    let tmp = cs[j];
                    let p = tmp.meta ? tmp.meta.key : "";
                    let hidden = tmp.hidden ? tmp.hidden : false;
                    if (!hidden && permissions[p]) {
                        child.push(tmp);
                    }
                }
                if (child.length > 0) {
                    if (child.length === 1) {
                        ps[i].leaf = true;
                    }
                    ps[i].children = child;
                    this.routeMap.push(ps[i]);
                }
            }
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
        position: fixed;
        top: 0;
    }
}

.drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
}

.navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0 !important;

    .hamburger-container {
        line-height: 58px;
        height: 50px;
        float: left;
        padding: 0 10px;
    }

    .screenfull {
        position: absolute;
        right: 90px;
        top: 16px;
        color: red;
    }

    .avatar-container {
        height: 50px;
        display: inline-block;
        position: absolute;
        right: 35px;

        .avatar-wrapper {
            cursor: pointer;
            margin-top: 5px;
            position: relative;

            .user-avatar {
                width: 40px;
                height: 40px;
                border-radius: 10px;
            }

            .el-icon-caret-bottom {
                position: absolute;
                right: -20px;
                top: 25px;
                font-size: 12px;
            }
        }
    }
}

.app-main {
    padding: 15px;
    /*50 = navbar*/
    min-height: calc(100vh - 50px);
    position: relative;
    overflow: hidden;
}

@media screen and (max-device-width: 700px) {
    .app-main {
        overflow: unset;
    }

    .chooseGame {
        width: 90px;
    }
}
</style>

<style>
.el-cascader-panel .el-radio {
    width: 100%;
    height: 100%;
    z-index: 10;
    position: absolute;
    top: 10px;
    right: -10px;
}

.el-cascader-panel .el-checkbox {
    width: 100%;
    height: 100%;
    z-index: 10;
    position: absolute;
    top: 0px;
    right: -10px;
}
</style>
