package com.xiaoxi.server.relic.controller

import com.xiaoxi.server.user.BaseAuthController

class RelicController : BaseAuthController() {

    @RPC
    //@IncludedBy(Permissions.IndexView)
    suspend fun getList() {

    }

    @RPC
    //@IncludedBy(Permissions.IndexView)
    suspend fun upload() {
    }
}