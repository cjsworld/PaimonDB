<template>
    <div v-if="!item.hidden&&item.children" class="menu-wrapper">
        <router-link v-if="hasOneShowingChildren(item.children) && !item.children[0].children"
                     :to="item.children[0].path">
            <el-menu-item :index="item.children[0].path" :class="{'submenu-title-noDropdown':!isNest}">
                <i v-if="item.meta&&item.meta.icon" :class="item.meta.icon"></i>
                <span v-if="item.children[0].name" slot="title">{{item.children[0].name}}</span>
            </el-menu-item>
        </router-link>

        <el-submenu v-else :index="item.name||item.path">
            <template slot="title">
                <i v-if="item.meta&&item.meta.icon" :class="item.meta.icon"></i>
                <span v-if="item.name" slot="title">{{item.name}}</span>
            </template>

            <template v-for="child in item.children" v-if="!child.hidden">
                <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0"
                              :item="child" :key="child.path" :base-path="child.path"></sidebar-item>

                <router-link v-else :to="child.path" :key="child.name">
                    <el-menu-item :index="child.path">
                        <i v-if="child.meta&&child.meta.icon" :class="child.meta.icon"></i>
                        <span v-if="child.name" slot="title">{{child.name}}</span>
                    </el-menu-item>
                </router-link>
            </template>
        </el-submenu>

    </div>
</template>

<script>
    export default {
        props: {
            item: {
                type: Object,
                required: true
            },
            isNest: {
                type: Boolean,
                default: false
            },
        },
        methods: {
            hasOneShowingChildren(children) {
                const showingChildren = children.filter(item => {
                    return !item.hidden
                });
                return showingChildren && showingChildren.length === 1;
            }
        }
    }
</script>
