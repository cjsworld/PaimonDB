<template>
    <el-form :model="loginForm" :rules="rules" ref="loginForm"
             label-position="left"
             label-width="0px"
             class="login-container"
             @keyup.enter.native="login()">
        <h3 class="title">登录</h3>
        <el-form-item prop="username">
            <el-input type="text" v-model="loginForm.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
            <el-input type="password" v-model="loginForm.password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" style="width: 100%" @click="login()">登录</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import CoreEngine from "@/core/CoreEngine";

export default {
    name: "Login",
    data() {
        return {
            loginForm: {
                username: 'admin',
                password: 'admin'
            },
            rules: {
                username: [
                    {required: true, message: '请输入用户名', trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'}
                ]
            }
        }
    },
    async created() {
    },
    methods: {
        login() {
            let query = this.$route.query;
            this.$refs.loginForm.validate(async valid => {
                if (valid) {
                    let res = await this.$api("user/login", this.loginForm);
                    if (res instanceof Error) return;
                    await this.$store.dispatch('user/setUser', res.user);
                    await this.$store.dispatch('user/setPermissions', res.permissions);
                    await CoreEngine.onUserChange(res.user.id);
                    if (query.target !== undefined && query.target !== '') {
                        this.$router.push(query.target);
                    } else {
                        this.$router.push('/index');
                    }
                }
            })
        }
    }
}
</script>


<style lang="scss" scoped>
.login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;

    .title {
        margin: 0 auto 40px auto;
        text-align: center;
        color: #505458;
    }
}
</style>
