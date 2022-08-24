<template>
    <el-row :gutter="25">
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <role></role>
        </el-col>
        <el-col :xs="24" :sm="12" :md="16" :lg="16" :xl="16">
            <user></user>
        </el-col>
    </el-row>
</template>

<script>
import Role from './components/role'
import User from './components/user'

export default {
    name: "Permission",
    components: {
        Role,
        User
    },
    data() {
        return {}
    }
}
</script>


