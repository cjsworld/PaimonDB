<template>
    <div class="verify-container">
        <h3 class="title">邮箱验证</h3>
        <el-alert :title="title" :type="type" center :closable="false" show-icon></el-alert>
        <el-form :model="verifyForm" :rules="rules" ref="verifyForm" v-if="showReVerify">
            <el-form-item prop="email" label="邮箱">
                <el-input type="text" v-model="verifyForm.email" placeholder="邮箱"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" style="width: 100%" @click="reVerify()">重新验证邮箱</el-button>
            </el-form-item>
        </el-form>
        <br>
        <el-link type="primary" :underline="false" style="float: right" href="/login">已有账号？去登录</el-link>
    </div>

</template>

<script>
export default {
    name: "VerifyEmail",
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
        return {
            type: 'success',
            title: undefined,
            desc: undefined,
            showReVerify: false,
            verifyForm: {
                email: undefined
            },
            rules: {
                email: [{required: true, validator: validateEmail, trigger: 'blur'}]
            }
        }
    },
    async created() {
        let query = this.$route.query
        let token = query.token;
        if (token) {
            await this.verify(token)
        } else {
            this.showReVerify = true;
            this.type = 'error'
            this.title = '邮箱验证失败，请重新发送验证请求'
        }
    },
    methods: {
        async verify(token) {
            let res = await this.$api("User/Verify", {token: token})
            console.log(res)
            if (res instanceof Error) {
                this.showReVerify = res.message.indexOf("请重新发送验证请求") > -1;
                this.type = 'error'
                this.title = res.message
                return;
            }
            this.showReVerify = false;
            this.type = 'success'
            this.title = '邮箱验证成功，请前往登录';
        },
        async reVerify() {
            this.$refs.verifyForm.validate(async valid => {
                if (valid) {
                    let res = await this.$api("User/ReVerify", this.verifyForm)
                    if (res instanceof Error) return
                    this.type = 'success'
                    this.title = '重新发送验证邮件成功，前往邮箱查看';
                }
            })
        }
    }
}
</script>


<style lang="scss" scoped>
.verify-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 450px;
    padding: 35px 35px 35px 35px;
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
