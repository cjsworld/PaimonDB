package com.xiaoxi.server.relic.controller

import com.xiaoxi.server.relic.dao.RelicInfo
import com.xiaoxi.server.user.BaseAuthController
import com.xserver.core.json.jobjectOf
import com.xserver.core.util.timestamp
import com.xserver.mongo.MongoClient
import com.xserver.mongo.eq
import com.xserver.mongo.nextID
import io.vertx.core.json.JsonArray
import io.vertx.core.json.JsonObject

class RelicController : BaseAuthController() {

    @RPC
    //@IncludedBy(Permissions.IndexView)
    suspend fun getList(lastModify: Long): List<JsonObject>? {
        val uid = user.id
        if (lastModify == RelicInfo.getUserRelicMaxModifyTime(uid)) {
            return null
        }
        return RelicInfo.getUserAllRelic(uid).map { it.toVO() }
    }

    @RPC
    //@IncludedBy(Permissions.IndexView)
    suspend fun upload(list: JsonArray): Int {
        val uid = user.id
        val curList = RelicInfo.getUserAllRelic(uid)
        var maxId = RelicInfo.getUserRelicMaxId(uid)
        val now = timestamp()
        val update = MongoClient.def.batchUpdate(RelicInfo::class){}
        val count = MongoClient.def.batchInsert(RelicInfo::class) {
            for (it in list) {
                it as JsonObject
                val relic = RelicInfo()
                relic.userId = uid
                relic.id = 0 //占位
                relic.fromClient(it)
                val cur = curList.find { it == relic }
                if (cur != null) {
                    if (cur.equippedAvatar != relic.equippedAvatar) {
                        update.add {
                            where(RelicInfo::userId eq uid)
                            where(RelicInfo::id eq cur.id)
                            set(RelicInfo::equippedAvatar, relic.equippedAvatar)
                            set(RelicInfo::modifyTime, now)
                        }
                    }
                } else {
                    relic.id = ++maxId
                    relic.modifyTime = now
                    add(relic)
                }
            }
        }.exec()
        update.exec()
        return count
    }

    @RPC
    //@IncludedBy(Permissions.IndexView)
    suspend fun addOrEdit(relic: JsonObject) {
        val uid = user.id
        var id = relic.getInteger("id")
        if (id == null) {
            id = RelicInfo.getUserRelicMaxId(uid) + 1
        }
        val r = RelicInfo().fromClient(relic)
        r.modifyTime = timestamp()
        MongoClient.def.update(RelicInfo::class) {
            where(RelicInfo::userId eq uid)
            where(RelicInfo::id eq id)
            update = jobjectOf("\$set" to r._raw)
            upsert = true
        }.exec()
    }

    @RPC
    //@IncludedBy(Permissions.IndexView)
    suspend fun delete(id: Int) {
        MongoClient.def.delete(RelicInfo::class) {
            where(RelicInfo::userId eq user.id)
            where(RelicInfo::id eq id)
        }.exec()
    }
}