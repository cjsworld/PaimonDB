package com.xiaoxi.server.user.controller

import com.xiaoxi.server.RootService
import com.xiaoxi.server.base.BoolState
import com.xiaoxi.server.base.WriteLog
import com.xiaoxi.server.user.ABaseController
import com.xiaoxi.server.user.LoginSession
import com.xiaoxi.server.user.Permissions
import com.xiaoxi.server.user.dao.User
import com.xiaoxi.server.user.dao.UserRole
import com.xiaoxi.server.user.dao.UserState
import com.xiaoxi.server.user.dao.VerifyEMail
import com.xiaoxi.server.util.SendEmail
import com.xserver.auth.AuthManager
import com.xserver.auth.annotation.AccessAllowAll
import com.xserver.auth.annotation.IncludedBy
import com.xserver.auth.annotation.NotAuth
import com.xserver.core.json.jobjectOf
import com.xserver.core.json.toJsonArray
import com.xserver.core.rpc.XException
import com.xserver.core.rpc.annotaion.Trim
import com.xserver.core.rpc.annotaion.TrimAsNull
import com.xserver.core.util.*
import com.xserver.mongo.MongoClient
import com.xserver.mongo.dbName
import com.xserver.mongo.eq
import com.xserver.mongo.nextID
import io.vertx.core.json.JsonArray
import io.vertx.core.json.JsonObject
import io.vertx.ext.web.RoutingContext

class UserController : ABaseController() {

    @RPC
    @NotAuth
    suspend fun Register(
        ctx: RoutingContext,
        @TrimAsNull email: String,
        @TrimAsNull password: String
    ): JsonObject {
        val ip = ctx.request().getHeader("X-Real-IP") ?: ctx.request().remoteAddress().host()
        RootService.locker.sync("Register") {
            var newUser = false
            var user = User.getByUserName(email)
            if (user == null) {
                user = User()
                user.id = User::class.nextID()
                user.username = email
                user.state = UserState.WaitVerify
                user.registerIP = ip
                user.createTime = timestamp()
                newUser = true
            } else {
                xcheck(user.state == UserState.WaitVerify, "用户已存在")
                //重新发送验证邮件
            }

            val token = UUIDUtil.longID().replace("-", "")
            val url = "${RootService.webUrl}/verify-email?token=$token"
            val sendRet = SendEmail.sendRegister(email, url)
//        xcheck(sendRet.error == null, sendRet.error!!)

            val verify = VerifyEMail()
            verify.token = token
            verify.email = email
            verify.state = BoolState.No
            verify.time = timestamp()
            verify.insert()

            user.password = MD5Util.hashString(password)
            user.roleId = 1

            if (newUser) {
                user.insert()
            } else {
                user.flush()
            }
            user.session = LoginSession(user)
            AuthManager.current!!.provider.login(user)
            return jobjectOf("user" to user.toVO(), "permissions" to AuthManager.current!!.getUserPermissionsMap(user))
        }
    }


    @RPC
    @NotAuth
    suspend fun ReVerify(@TrimAsNull email: String) {
        RootService.locker.sync("ReVerify-$email") {
            val user = User.getByUserName(email).notNull("邮箱未注册")
            xcheck(user.state == UserState.WaitVerify, "邮箱已验证")
            val token = UUIDUtil.longID().replace("-", "")
            val url = "${RootService.webUrl}/verify-email?token=$token"
            val sendRet = SendEmail.sendRegister(email, url)
//        xcheck(sendRet.error == null, sendRet.error!!)

            val verify = VerifyEMail()
            verify.token = token
            verify.email = email
            verify.state = BoolState.No
            verify.time = timestamp()
            verify.insert()
        }
    }

    @RPC
    @NotAuth
    suspend fun Verify(token: String) {
        val t = VerifyEMail.getByToken(token) ?: throw XException("验证token异常，请重新发送验证请求", "send")
        xcheck(t.state == BoolState.No, "邮箱已验证")
        if (t.time < timestamp() - VerifyEMail.ValidTime) {
            throw XException("验证邮件已过期，请重新发送验证请求", "send")
        }
        val user = User.getByUserName(t.email).notNull("邮箱未注册，请前往注册页面注册")
        xcheck(user.state == UserState.WaitVerify, "邮箱已验证")
        user.state = UserState.Enable
        user.flush()

        t.state = BoolState.Yes
        t.verifyTime = timestamp()
        t.flush()
    }

    @RPC
    @NotAuth
    suspend fun Login(ctx: RoutingContext, @Trim username: String, @Trim password: String): JsonObject {
        val ip = ctx.request().getHeader("X-Real-IP") ?: ctx.request().remoteAddress().host()
        xcheck(username.isNotBlank() && password.isNotBlank(), "用户名或密码为空")
        val user = User.getByUserName(username).notNull("用户不存在")
        if (user.password.isEmpty()) {
            user.password = password
        } else {
            xcheck(user.password == MD5Util.hashString(password), "用户名或密码错误")
        }
        user.loginIP = ip
        user.lastLogin = timestamp()
        user.flush()
        user.session = LoginSession(user)
        AuthManager.current!!.provider.login(user)
        return jobjectOf("user" to user.toVO(), "permissions" to AuthManager.current!!.getUserPermissionsMap(user))
    }

    /**
     * 获取自己的用户信息和权限
     */
    @RPC
    @AccessAllowAll
    fun GetMineInfo(): JsonObject {
        return jobjectOf("user" to user.toVO(), "permissions" to AuthManager.current!!.getUserPermissionsMap(user))
    }

    @RPC
    @AccessAllowAll
    suspend fun Logout() {
        AuthManager.current!!.provider.logout()
    }

    @RPC
    @AccessAllowAll
    suspend fun GetPermissionTree(): JsonArray {
        return RootService.auth.getPermissionTree()
    }

    @RPC
    @IncludedBy(Permissions.SystemUserEdit)
    suspend fun GetRoles(): List<JsonObject> {
        return MongoClient.def.query(UserRole::class) {}.findObject<UserRole>().map { it.toVO() }
    }

    @RPC
    @IncludedBy(Permissions.SystemUserEdit)
    @WriteLog("新增/编辑角色")
    suspend fun AddOrEditRole(id: Int?, @TrimAsNull name: String, permissions: JsonArray) {
        val ps = permissions.map { it as String }.distinct()
        ps.forEach {
            RootService.auth.getPermission(it).notNull("无效的权限: $it")
        }

        suspend fun checkName() {
            val count = MongoClient.def.query(UserRole::class) {
                where(UserRole::name eq name)
            }.count()
            xcheck(count <= 0, "名称已存在")
        }

        val role: UserRole
        if (id == null) {
            checkName()
            role = UserRole()
            role.id = UserRole::class.nextID()
        } else {
            role = UserRole.getByID(id)!!.notNull("角色不存在")
            if (role.name != name) {
                checkName()
            }
        }

        role.name = name
        role.permission = ps.toJsonArray()
        role.insert(true)

        RootService.auth.setRolePermission(role.id.toString(), ps)
    }

    @RPC
    @AccessAllowAll
    suspend fun GetAdminNames(): Map<Int, String> {
        return MongoClient.def.query(User::class) {
            where(User::state eq BoolState.Yes.value)
            excludeID()
            select(User::id, User::name)
        }.find().associate {
            it.getInteger(User::id.dbName) to it.getString(User::name.dbName)
        }
    }

    @RPC
    @IncludedBy(Permissions.SystemUserEdit)
    suspend fun ListAdmins(): List<JsonObject> {
        val roleMap = MongoClient.def.query(UserRole::class) {
        }.findObject<UserRole>().associate { it.id to it.name }.toMutableMap()
        roleMap[User.SuperID] = "超级管理员"
        return MongoClient.def.query(User::class) {
            where(User::state eq BoolState.Yes.value)
            excludeID()
        }.findObject<User>().map { it.toVO(User.LIST_VO).put("roleName", roleMap[it.roleId] ?: "/") }
    }

    @RPC
    @IncludedBy(Permissions.SystemUserEdit)
    @WriteLog("启用/禁用用户")
    suspend fun SetUserEnable(id: Int, state: UserState) {
        val user = User.getByID(id).notNull("用户不存在")
        user.state = state
        user.flush()
    }
}
