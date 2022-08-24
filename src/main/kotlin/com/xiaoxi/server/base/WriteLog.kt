package com.xiaoxi.server.base

import com.xiaoxi.server.rpcLog.dao.RPCLog
import com.xiaoxi.server.user.dao.User
import com.xserver.auth.AuthUser
import com.xserver.core.fiber.RunContext
import com.xserver.core.rpc.RPCAfterInterceptor
import com.xserver.core.rpc.RPCInterceptorDefine
import com.xserver.core.rpc.RPCReq
import com.xserver.core.rpc.RPCResp
import com.xserver.core.util.timestamp

@RPCInterceptorDefine(WriteLogImpl::class)
annotation class WriteLog(val desc: String, val logRet: Boolean = true)

class WriteLogImpl : RPCAfterInterceptor {
    companion object {
        var disableWriteLog by RunContext.NullableSingleton<Boolean>("disableWriteLog")
        var overrideLogName by RunContext.NullableSingleton<String>("overrideLogName")
    }

    override suspend fun after(annotation: Annotation, req: RPCReq, resp: RPCResp): RPCResp {
        if (disableWriteLog == true) {
            return resp
        }
        annotation as WriteLog
        val log = RPCLog()
        val user = AuthUser.current as User?
        log.user = user?.id ?: 0
        log.action = req.path
        log.desc = overrideLogName ?: annotation.desc
        log.param = req.param.raw
        log.error = resp.error
        if (annotation.logRet) {
            log.ret = resp.jsonSafeResp
        } else {
            log.ret = null
        }
        log.time = timestamp()
        log.insert()
        return resp
    }
}
