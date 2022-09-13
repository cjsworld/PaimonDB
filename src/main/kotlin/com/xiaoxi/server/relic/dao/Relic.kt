package com.xiaoxi.server.relic.dao

import com.xiaoxi.server.base.DaoTable
import com.xserver.mongo.MongoClient
import com.xserver.mongo.MongoDBObject
import io.vertx.core.json.JsonObject

class Relic(root: JsonObject = JsonObject()) : MongoDBObject(root) {

    companion object : DaoTable {
        override suspend fun createIndex() {
            MongoClient.def.createIndex(Relic::class) {
                addIndex(Relic::userId to 1, Relic::id to 1).unique = true
            }.exec()
        }
    }


    @PrimaryKey
    var userId by IntField

    @PrimaryKey
    var id by IntField

    var setId by IntField
    var rank by IntField
    val slotIndex by IntField
    var level by IntField
    var mainPropTypeId by StringField

    val subProp1TypeId by StringField
    var subProp1Value by DoubleField

    val subProp2TypeId by StringField
    var subProp2Value by DoubleField

    val subProp3TypeId by StringField
    var subProp3Value by DoubleField

    val subProp4TypeId by StringField
    var subProp4Value by DoubleField

    var equippedAvatar by IntField.Nullable
}
