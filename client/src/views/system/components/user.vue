<template>
    <div>
        <el-card class="box-card-total">
            <div slot="header">
                <span>管理员信息</span>
                <el-button icon="el-icon-plus" class="box-card-btn" type="text" @click="addUser">新增用户</el-button>
            </div>
            <el-table :data="list" border>
                <el-table-column prop="id" label="序号" width="60"/>
                <el-table-column prop="username" label="用户名" width="120"></el-table-column>
                <el-table-column prop="name" label="名称" width="120"></el-table-column>
                <el-table-column prop="roleName" label="角色" width="120"></el-table-column>
                <el-table-column label="创建时间" width="170">
                    <template slot-scope="scope">
                        {{ $formatTime(scope.row.createTime) }}
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="100">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.enable===1">启用</el-tag>
                        <el-tag type="danger" v-else>禁用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="action" label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="editUser(scope.row)" v-if="scope.row.roleId > 0">编辑</el-button>
                        <el-button type="success" size="mini" v-if="scope.row.enable === 0" @click="setEnable(scope.row.id,1)">启用</el-button>
                        <el-button type="danger" size="mini" v-else @click="setEnable(scope.row.id,0)">禁用</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-drawer :title="title" :visible.sync="visible" :before-close="drawerClose">
            <el-form ref="userForm" :model="userForm" :label-width="'80px'" :rules="rules" class="drawer-form">
                <el-form-item prop="username" label="用户名">
                    <el-input v-model="userForm.username" placeholder="请输入用户名"/>
                </el-form-item>
                <el-form-item prop="name" label="名称">
                    <el-input v-model="userForm.name" placeholder="请输入名称"/>
                </el-form-item>
                <el-form-item prop="password" label="密码">
                    <el-input v-model="userForm.password" placeholder="请输入密码"/>
                </el-form-item>
                <el-form-item prop="roleId" label="角色">
                    <el-select v-model="userForm.roleId">
                        <el-option v-for="role in roles" :key="role.id" :value="parseInt(role.id)"
                                   :label="role.name"></el-option>
                    </el-select>
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
    name: "User",
    data() {
        return {
            list: [],
            roles: [],
            title: '',
            visible: false,
            userForm: {
                id: undefined,
                username: undefined,
                name: undefined,
                password: undefined,
                roleId: undefined
            },
            rules: {
                username: {required: true, message: '请输入用户名'},
                name: {required: true, message: '请输入名称'},
                roleId: {required: true, message: '请选择角色'}
            }
        }
    },
    async created() {
        await this.getList()
    },
    methods: {
        async getRoleList() {
            if (this.roles.length > 0) return
            let tmp = await this.$api("User/GetRoles")
            if (tmp instanceof Error) return
            this.roles = tmp
        },
        async getList() {
            let tmp = await this.$api("User/ListAdmins")
            if (tmp instanceof Error) return
            this.list = tmp
        },
        async addUser() {
            await this.getRoleList();
            this.title = '新增用户'
            this.visible = true;
        },
        async editUser(row) {
            await this.getRoleList();
            this.userForm.id = row.id
            this.visible = true;
            this.$nextTick(() => {
                this.userForm.username = row.username;
                this.userForm.password = row.password;
                this.userForm.name = row.name;
                this.userForm.roleId = row.roleId;
            })
        },
        drawerClose() {
            this.userForm.id = undefined
            this.$refs.userForm.resetFields()
            this.visible = false;
        },
        addOrEdit() {
            this.$refs.userForm.validate(async valid => {
                if (valid) {
                    let tmp = await this.$api("User/AddOrEditAdmin", this.userForm)
                    if (tmp instanceof Error) return
                    this.drawerClose()
                    this.$message.success("操作成功");
                    await this.getList()
                }
            })
        },
        async setEnable(id, enable) {
            let res = await this.$api("App/SetEnable", {id: id, enable: enable});
            if (res instanceof Error) return
            this.$message.success("操作成功");
            await this.getList();
        },
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
