package com.xiaoxi.server.rpcLog.dao

import com.xiaoxi.server.base.VO
import com.xiaoxi.server.base.ToVO
import com.xiaoxi.server.base.DaoTable
import com.xserver.mongo.MongoClient
import com.xserver.mongo.MongoDBObject
import io.vertx.core.json.JsonObject

class RPCLog(raw: JsonObject = JsonObject()): MongoDBObject(raw), ToVO {
    companion object : DaoTable {
        override suspend fun createIndex() {
            MongoClient.def.createIndex(RPCLog::class) {
                addIndex(RPCLog::time to -1)
                addIndex(RPCLog::action to 1, RPCLog::time to -1)
                addIndex(RPCLog::user to 1, RPCLog::time to -1)
            }.exec()
        }
    }

    @VO
    var user by IntField

    @VO
    var action by StringField

    @VO
    var desc by StringField

    @VO
    var param by AnyField.Nullable

    @VO
    var error by StringField.Nullable

    @VO
    var ret by AnyField.Nullable

    @VO
    var time by LongField
}