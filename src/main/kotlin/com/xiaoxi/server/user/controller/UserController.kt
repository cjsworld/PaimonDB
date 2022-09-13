package com.xiaoxi.server.user.controller

import com.xiaoxi.server.RootService
import com.xiaoxi.server.base.BoolState
import com.xiaoxi.server.base.WriteLog
import com.xiaoxi.server.user.BaseAuthController
import com.xiaoxi.server.user.LoginSession
import com.xiaoxi.server.user.Permissions
import com.xiaoxi.server.user.dao.User
import com.xiaoxi.server.user.dao.UserRole
import com.xserver.auth.AuthManager
import com.xserver.auth.annotation.AccessAllowAll
import com.xserver.auth.annotation.IncludedBy
import com.xserver.auth.annotation.NotAuth
import com.xserver.core.json.jobjectOf
import com.xserver.core.json.toJsonArray
import com.xserver.core.rpc.annotaion.Trim
import com.xserver.core.rpc.annotaion.TrimAsNull
import com.xserver.core.util.*
import com.xserver.mongo.MongoClient
import com.xserver.mongo.dbName
import com.xserver.mongo.eq
import com.xserver.mongo.nextID
import io.vertx.core.json.JsonArray
import io.vertx.core.json.JsonObject

class UserController : BaseAuthController() {

    @RPC
    @NotAuth
    suspend fun Login(@Trim username: String, @Trim password: String): JsonObject {
        xcheck(username.isNotBlank() && password.isNotBlank(), "用户名或密码为空")
        val user = User.getByUserName(username).notNull("用户不存在")
        if (user.password.isEmpty()) {
            user.password = password
        } else {
            xcheck(user.password == MD5Util.hashString(password), "用户名或密码错误")
        }
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
            where(User::enable eq BoolState.Yes.value)
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
            where(User::enable eq BoolState.Yes.value)
            excludeID()
        }.findObject<User>().map { it.toVO(User.LIST_VO).put("roleName", roleMap[it.roleId] ?: "/") }
    }

    @RPC
    @IncludedBy(Permissions.SystemUserEdit)
    @WriteLog("添加/编辑用户")
    suspend fun AddOrEditAdmin(
        id: Int?,
        @TrimAsNull username: String,
        @TrimAsNull name: String,
        @Trim password: String?,
        roleId: Int
    ) {
        UserRole.getByID(roleId).notNull("角色不存在")
        val user: User
        if (id == null) {
            User.getByUserName(username).isNull("用户已存在")
            user = User()
            user.id = User::class.nextID()
            user.createTime = timestamp()
        } else {
            user = User.getByID(id).notNull("用户不存在")
            if (user.username != username) {
                User.getByUserName(username).isNull("用户已存在")
            }
            xcheck(user.roleId != User.SuperID, "无效的权限")
        }

        user.username = username
        user.name = name
        user.password = password ?: ""
        user.enable = BoolState.Yes
        user.roleId = roleId

        user.insert(true)
    }

    @RPC
    @IncludedBy(Permissions.SystemUserEdit)
    @WriteLog("启用/禁用用户")
    suspend fun SetUserEnable(id: Int, enable: BoolState) {
        val user = User.getByID(id).notNull("用户不存在")
        user.enable = enable
        user.flush()
    }
}
