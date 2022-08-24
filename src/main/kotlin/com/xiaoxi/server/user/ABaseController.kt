package com.xiaoxi.server.user

import com.xiaoxi.server.user.dao.User
import com.xserver.auth.AuthUser
import com.xserver.auth.annotation.CheckPermission
import com.xserver.core.rpc.BaseController

@CheckPermission
open class ABaseController : BaseController() {
    val user: User get() = AuthUser.current as User
}
