package com.xiaoxi.server.user.controller

import com.xiaoxi.server.user.BaseAuthController
import com.xiaoxi.server.user.Permissions
import com.xserver.auth.annotation.IncludedBy

class IndexController : BaseAuthController() {

    @RPC
    @IncludedBy(Permissions.IndexView)
    suspend fun index() {
    }
}