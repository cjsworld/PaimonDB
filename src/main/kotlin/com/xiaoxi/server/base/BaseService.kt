package com.xiaoxi.server.base

import com.xiaoxi.server.RootService
import com.xserver.core.Service
import com.xserver.core.util.ClassUtil
import kotlin.reflect.full.companionObjectInstance

abstract class BaseService : Service {
    override suspend fun onStart() {
        val daoList = ClassUtil.getClasses(this::class.java.`package`.name + ".dao")
        if (daoList != null) {
            for (cls in daoList) {
                val comp = try {
                    Class.forName(cls).kotlin.companionObjectInstance
                } catch (e: Throwable) {
                    continue
                }
                if (comp is DaoTable) {
                    comp.createIndex()
                }
            }
        }
        RootService.ctrl.addControllerFromPackage(this::class.java.`package`.name + ".controller")
    }
}