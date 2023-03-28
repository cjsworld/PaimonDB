package com.xiaoxi.server.user

import com.xiaoxi.server.RootService
import com.xiaoxi.server.base.BaseService
import com.xiaoxi.server.user.dao.User
import com.xiaoxi.server.user.dao.UserRole
import com.xiaoxi.server.user.dao.UserState
import com.xserver.core.json.jarrayOf
import com.xserver.core.util.MD5Util
import com.xserver.core.util.timestamp
import com.xserver.mongo.MongoClient
import com.xserver.mongo.dbTable
import com.xserver.mongo.eq

object UserService : BaseService() {

    override suspend fun onStart() {
        super.onStart()

        initSuperAdminRole()
        setPermission()
    }

    private suspend fun initSuperAdminRole() {
        var role = UserRole.getByID(User.SuperID)
        if (role == null) {
            MongoClient.def.update(MongoClient.ID_TABLE_NAME) {
                where("Name" eq UserRole::class.dbTable)
                setMax("ID", 1)
                upsert = true
            }.exec()
            role = UserRole()
            role.id = User.SuperID
            role.name = "超级管理员"
            role.permission = jarrayOf()
            role.insert()
        }
        var admin = User.getByID(1)
        if (admin == null) {
            MongoClient.def.update(MongoClient.ID_TABLE_NAME) {
                where("Name" eq User::class.dbTable)
                setMax("ID", 1)
                upsert = true
            }.exec()
            admin = User()
            admin.id = 1
            admin.username = "admin"
            admin.password = MD5Util.hashString("admin")
            admin.name = "admin"
            admin.state = UserState.Enable
            admin.roleId = User.SuperID
            admin.createTime = timestamp()
            admin.lastLogin = timestamp()
            admin.insert()
        }
    }

    private suspend fun setPermission() {
        MongoClient.def.query(UserRole::class) {
        }.findObject<UserRole>().forEach {
            RootService.auth.setRolePermission(it.id.toString(), it.permission)
        }
    }
}
