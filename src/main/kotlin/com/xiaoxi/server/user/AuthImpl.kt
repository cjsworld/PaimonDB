package com.xiaoxi.server.user

import com.xiaoxi.server.RootService
import com.xiaoxi.server.user.dao.User
import com.xiaoxi.server.user.dao.UserState
import com.xserver.auth.AuthUser
import com.xserver.auth.provider.HttpCookieAuthProvider

class AuthImpl : HttpCookieAuthProvider("token", null) {

    override suspend fun authenticateByToken(token: String?): AuthUser {
        if (token == null) {
            authenticateFailed("未登录")
        }
        val jwt = RootService.jwt.verifyOrNull(token) ?: authenticateFailed("Token无效")
        val session = LoginSession(jwt)

        val user = User.getByID(session.uid) ?: authenticateFailed("Token无效")

        if (user.state == UserState.Disable) {
            authenticateFailed("帐号已封停")
        }
        user.session = session
        return user
    }

    override suspend fun generateToken(user: AuthUser): String {
        user as User
        return user.session!!.signJwt()
    }
}
