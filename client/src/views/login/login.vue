<template>
    <div>
        <el-form :model="loginForm" :rules="loginRules" ref="loginForm"
                 v-show="isLogin"
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
            <el-form-item>
                <el-link type="primary" :underline="false" style="float: right" @click="isLogin = false">已有账号？去注册</el-link>
            </el-form-item>
        </el-form>
        <el-form :model="registerForm" :rules="regRules" ref="registerForm"
                 v-show="!isLogin"
                 class="login-container"
                 @keyup.enter.native="register()">
            <h3 class="title">注册</h3>
            <el-form-item prop="email" label="邮箱">
                <el-input type="text" v-model="registerForm.email" placeholder="邮箱"></el-input>
            </el-form-item>
            <el-form-item prop="password" label="密码">
                <el-input type="password" v-model="registerForm.password" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item prop="pwd2" label="再次确认密码">
                <el-input type="password" v-model="registerForm.pwd2" placeholder="再次确认密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" style="width: 100%" @click="register()">注册</el-button>
            </el-form-item>
            <el-form-item>
                <el-link type="primary" :underline="false" style="float: right" @click="isLogin = true">已有账号？去登录</el-link>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import CoreEngine from "@/core/CoreEngine";

export default {
    name: "Login",
    data() {
        let validateEmail = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入邮箱'));
            } else {
                let reg = /^[A-Za-z0-9]+([_.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/;
                if (!reg.test(value)) {
                    callback(new Error('请输入正确的邮箱'))
                } else {
                    callback()
                }
            }
        };
        let validatePass = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入密码'));
            } else {
                let reg = /(?=.*([a-zA-Z].*))(?=.*\d.*)[a-zA-Z\d-*/+.~!@#$%^&()]{6,}/
                if (!reg.test(value)) {
                    callback(new Error('至少6个字符且包含数字、字母'))
                } else {
                    callback()
                }
            }
        };
        let validatePass2 = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.registerForm.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            isLogin: true,
            loginForm: {
                username: 'admin',
                password: 'admin'
            },
            loginRules: {
                username: [
                    {required: true, message: '请输入用户名', trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'}
                ]
            },
            registerForm: {
                email: undefined,
                password: undefined,
                pwd2: undefined
            },
            regRules: {
                email: [{required: true, validator: validateEmail, trigger: 'blur'}],
                password: [{required: true, validator: validatePass, trigger: 'blur'}],
                pwd2: [{required: true, validator: validatePass2, trigger: 'blur'}]
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
        },
        register() {
            let query = this.$route.query;
            this.$refs.registerForm.validate(async valid => {
                if (valid) {
                    let res = await this.$api("User/Register", this.registerForm)
                    if (res instanceof Error) return
                    await this.$store.dispatch('user/setUser', res.user)
                    await this.$store.dispatch('user/setPermissions', res.permissions)
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
