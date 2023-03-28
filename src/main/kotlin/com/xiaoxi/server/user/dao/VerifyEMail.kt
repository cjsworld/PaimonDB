package com.xiaoxi.server.user.dao

import com.xiaoxi.server.base.BoolState
import com.xiaoxi.server.base.DaoTable
import com.xserver.mongo.MongoClient
import com.xserver.mongo.MongoDBObject
import com.xserver.mongo.eq
import io.vertx.core.json.JsonObject

class VerifyEMail(raw: JsonObject = JsonObject()) : MongoDBObject(raw) {

    companion object : DaoTable {

        const val ValidTime = 60L * 60

        override suspend fun createIndex() {
            MongoClient.def.createIndex(VerifyEMail::class) {
                addIndex(VerifyEMail::token to 1).unique = true
                addIndex(VerifyEMail::email to 1, VerifyEMail::time to -1)
            }.exec()
        }

        suspend fun getByToken(token: String): VerifyEMail? {
            return MongoClient.def.query(VerifyEMail::class) {
                where(VerifyEMail::token eq token)
            }.findOneObject()
        }
    }

    @PrimaryKey
    var token by StringField

    var email by StringField

    var time by LongField

    var state by EnumField(BoolState::class)

    var verifyTime by LongField.Nullable
}