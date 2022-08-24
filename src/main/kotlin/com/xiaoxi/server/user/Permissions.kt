package com.xiaoxi.server.user

import com.xserver.auth.AuthManager

object Permissions {

    const val IndexView = "/index"

    //系统
    const val SystemOpLog = "system/oplog"
    const val SystemUserEdit = "system/user/edit"

    fun buildTree(auth: AuthManager) {
        with(auth) {
            addLayer("首页").apply {
                addPermission(IndexView, "首页")
            }
            addLayer("兑换码").apply {
                addPermission(IndexView, "兑换码")
            }
            addLayer("邮件").apply {
                addPermission(IndexView, "邮件")
            }
            addLayer("系统").apply {
                addPermission(SystemUserEdit, "权限管理")
                addPermission(SystemOpLog, "操作日志")
            }
        }
    }
}
