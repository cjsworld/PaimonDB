package com.xiaoxi.server.user.controller

import com.xiaoxi.server.user.ABaseController
import com.xiaoxi.server.user.Permissions
import com.xserver.auth.annotation.IncludedBy

class IndexController : ABaseController() {

    @RPC
    @IncludedBy(Permissions.IndexView)
    suspend fun Index() {
    }
}