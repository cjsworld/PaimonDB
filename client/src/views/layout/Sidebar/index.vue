<template>
    <el-scrollbar wrapClass="scrollbar-wrapper">
        <el-menu
                :default-active="$route.path"
                mode="vertical"
                :show-timeout="200"
                :collapse="isCollapse"
                background-color="#34383D"
                text-color="#fff"
                active-text-color="#ffd04b">
            <sidebar-item v-for="route in routeMap" :key="route.name" :item="route"
                          :base-path="route.path"/>
        </el-menu>
    </el-scrollbar>
</template>

<script>
    import SidebarItem from './SidebarItem'

    export default {
        components: {SidebarItem},
        props: {
            sidebar: {
                type: Object, required: true
            },
            routeMap: {
                type: Array, required: true
            }
        },
        data: function () {
            return {}
        },
        computed: {
            isCollapse() {
                return !this.sidebar.opened
            }
        }
    }
</script>
