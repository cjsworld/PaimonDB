<template>
    <div id="app">
        <transition name="fade"
                    mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    export default {
        name: 'app',
        components: {}
    }

</script>

<style lang="scss">
    body {
        margin: 0;
        padding: 0;
        font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
        font-size: 14px;
        -webkit-font-smoothing: antialiased;
    }

    @media screen and (max-device-width: 700px) {
        .el-message-box {
            width: 300px !important;
        }
    }

    #app {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
    }

    .el-submenu [class^=fa] {
        vertical-align: baseline;
        margin-right: 10px;
    }

    .el-menu-item [class^=fa] {
        vertical-align: baseline;
        margin-right: 10px;
    }

    .toolbar {
        background: #f2f2f2;
        padding: 10px;
        margin: 10px 0;
        .el-form-item {
            margin-bottom: 10px;
        }
    }

    .el-table td {
        padding: 7px 0px;
    }

    .el-table th {
        padding: 7px 0px;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: all .2s ease;
    }

    .fade-enter,
    .fade-leave-active {
        opacity: 0;
    }

    .form-padding {
        padding: 0 7px;
    }

    .margin-bottom {
        margin-bottom: 10px;
    }

    .font-color-0 {
        color: rgb(0, 183, 181);
    }

    .font-color-1 {
        color: rgb(250, 167, 50);
    }

    .font-color-2 {
        color: rgb(255, 0, 0);
    }

    .font-color-10 {
        color: rgb(0, 200, 0);
    }

    .font-color-11 {
        color: #000;
    }

    .font-color-12 {
        color: rgb(233, 0, 229);
    }

    .font-color-true {
        color: green;
    }

    .font-color-false {
        color: red;
    }

    .link-color, link-color:link, .link-color:active, .link-color:hover, .link-color:visited {
        color: #409eff !important;
    }
</style>
