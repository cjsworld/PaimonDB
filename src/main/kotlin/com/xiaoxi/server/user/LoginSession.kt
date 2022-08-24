package com.xiaoxi.server.user

import com.auth0.jwt.interfaces.DecodedJWT
import com.xiaoxi.server.RootService
import com.xiaoxi.server.user.dao.User
import com.xserver.core.util.timestamp

class LoginSession {
    companion object {
        //过期时间
        const val EXPIRE_TIME = 86400L * 30
    }

    val uid: Int
    var issuedAt: Long
    var expiresAt: Long

    constructor(jwt: DecodedJWT) {
        uid = jwt.getClaim("uid").asInt()!!
        issuedAt = jwt.issuedAt.time / 1000
        expiresAt = jwt.expiresAt.time / 1000
    }

    constructor(user: User) {
        uid = user.id
        issuedAt = timestamp()
        expiresAt = issuedAt + EXPIRE_TIME
    }

    fun signJwt(): String {
        return RootService.jwt.sign(
            issuedAt = issuedAt,
            expiresAt = expiresAt,
            mapOf("uid" to uid)
        )
    }
}