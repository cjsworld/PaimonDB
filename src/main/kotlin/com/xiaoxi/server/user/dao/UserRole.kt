package com.xiaoxi.server.user.dao

import com.xiaoxi.server.base.DaoTable
import com.xiaoxi.server.base.ToVO
import com.xiaoxi.server.base.VO
import com.xserver.core.Alias
import com.xserver.mongo.MongoClient
import com.xserver.mongo.MongoDBObject
import com.xserver.mongo.eq
import io.vertx.core.json.JsonObject

class UserRole(root: JsonObject = JsonObject()) : MongoDBObject(root), ToVO {

    companion object : DaoTable {
        override suspend fun createIndex() {}
        suspend fun getByID(id: Int): UserRole? {
            return MongoClient.def.query(UserRole::class) {
                where(UserRole::id eq id)
            }.findOneObject()
        }
    }

    @PrimaryKey
    @Alias("_id")
    @VO
    var id by IntField

    @VO
    var name by StringField

    @VO
    var permission by JsonArrayField
}
