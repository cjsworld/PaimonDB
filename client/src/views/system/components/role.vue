<template>
    <div>
        <el-card class="box-card-total">
            <div slot="header">
                <span>角色权限</span>
                <el-button icon="el-icon-plus" class="box-card-btn" type="text" @click="addRole">新增角色</el-button>
            </div>
            <el-table :data="list" border>
                <el-table-column prop="id" label="序号" width="60"/>
                <el-table-column prop="name" label="角色名称"></el-table-column>
                <el-table-column prop="action" label="操作">
                    <template slot-scope="scope">
                        <el-button type="info" size="mini" @click="editRole(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-drawer :title="title" :visible.sync="visible" :before-close="drawerClose">
            <el-form ref="roleForm" :model="roleForm" :rules="rules" class="drawer-form">
                <el-form-item prop="name" label="角色名称">
                    <el-input v-model="roleForm.name" placeholder="请输入角色名称"/>
                </el-form-item>
                <el-form-item prop="tree" label="角色权限">
                    <div style="width: 100%;overflow: auto">
                        <el-tree ref="tree" :data="roleForm.tree" :props="defaultProps" show-checkbox :default-expanded-keys="Object.keys($store.getters.permissions)" node-key="key"></el-tree>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="info" size="small" @click="drawerClose">关闭</el-button>
                    <el-button type="primary" size="small" @click="addOrEdit">确定</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </div>
</template>
<script>
export default {
    name: 'Role',
    data() {
        return {
            list: [],
            title: '',
            visible: false,
            defaultProps: {
                children: 'list',
                label: 'name'
            },
            roleForm: {
                id: undefined,
                name: undefined,
                tree: []
            },
            rules: {
                name: {required: true, message: '请输入角色名称'}
            }
        }
    },
    async created() {
        await this.getList()
    },
    methods: {
        async getList() {
            let tmp = await this.$api("User/GetRoles")
            if (tmp instanceof Error) return
            this.list = tmp
        },
        async getPMTree() {
            if (this.roleForm.tree > 0) return
            let tmp = await this.$api("User/GetPermissionTree")
            if (tmp instanceof Error) return
            this.roleForm.tree = tmp
        },
        async addRole() {
            await this.getPMTree()
            this.title = "新增角色"
            this.visible = true
        },
        async editRole(row) {
            await this.getPMTree()
            this.title = "新增角色"
            this.visible = true
            this.roleForm.id = row.id
            this.$nextTick(() => {
                this.roleForm.name = row.name
                this.$refs.tree.setCheckedKeys(row.permission, true, false)
            })
        },
        drawerClose() {
            this.roleForm.id = undefined
            this.$refs.tree.setCheckedKeys([], true, false)
            this.$refs.roleForm.resetFields()
            this.visible = false;
        },
        addOrEdit() {
            this.$refs.roleForm.validate(async valid => {
                if (valid) {
                    let nodes = this.$refs.tree.getCheckedNodes(false, true)
                    let select = []
                    nodes.forEach(item => {
                        if (item.key && !select.includes(item.key)) {
                            select.push(item.key)
                        }
                    })
                    let param = {
                        id: this.$formatIntValue(this.roleForm.id),
                        name: this.roleForm.name,
                        permissions: select
                    }
                    let tmp = await this.$api("User/AddOrEditRole", param)
                    if (tmp instanceof Error) return
                    this.drawerClose()
                    this.$message.success("操作成功");
                    await this.getList()
                }
            })
        }
    }
}
</script>
<style scoped lang="scss">
.box-card-total {
    .box-card-btn {
        float: right;
        padding: 3px 0
    }
}

.drawer-form {
    padding: 0 20px;
}
</style>
