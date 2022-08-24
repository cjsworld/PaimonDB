package com.xiaoxi.server.system.dao

import com.xiaoxi.server.base.DaoTable
import com.xserver.mongo.MongoClient
import com.xserver.mongo.MongoDBObject
import io.vertx.core.json.JsonObject

class Config(root: JsonObject = JsonObject()) : MongoDBObject(root) {

    companion object : DaoTable {
        override suspend fun createIndex() {
            MongoClient.def.createIndex(Config::class) {
                addIndex(Config::k to 1).unique = true
            }.exec()
        }

        suspend fun get(key: String): Config? {
            val config = Config()
            config.k = key
            return if (config.fetch()) {
                config
            } else {
                null
            }
        }

        suspend fun set(key: String, value: Any) {
            val config = Config()
            config.k = key
            config.v = value
            config.insert(true)
        }
    }


    @PrimaryKey
    var k by StringField

    var v by AnyField

    suspend fun setAndFlush(value: Any) {
        if (v != value) {
            v = value
            flush()
        }
    }

    fun getInt(): Int = (v as Number).toInt()
    fun getLong(): Long = (v as Number).toLong()
    fun getFloat(): Float = (v as Number).toFloat()
    fun getDouble(): Double = (v as Number).toDouble()
    fun getBoolean(): Boolean = v as Boolean
    fun getString(): String = v as String
}
