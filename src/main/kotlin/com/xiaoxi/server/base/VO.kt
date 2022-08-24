package com.xiaoxi.server.base

import com.xserver.core.util.IntEnum
import com.xserver.mongo.MongoDBObject
import com.xserver.mongo.MongoDBSubObject
import io.vertx.core.json.JsonObject
import kotlin.reflect.KProperty1
import kotlin.reflect.full.findAnnotation
import kotlin.reflect.full.memberProperties

@Target(AnnotationTarget.PROPERTY)
annotation class VO(val name: String = "", vararg val voKeys: String, val ignoreNull: Boolean = false)

interface ToVO {
    private fun transformToVO(v: Any?, key: String?): Any? {
        return when (v) {
            is MongoDBObject,
            is MongoDBSubObject -> {
                val root = JsonObject()
                for (k in v::class.memberProperties) {
                    val vo = k.findAnnotation<VO>()
                    if (vo != null) {
                        if (vo.voKeys.isNotEmpty() && (key == null || !vo.voKeys.contains(key))) {
                            continue
                        }
                        @Suppress("UNCHECKED_CAST")
                        k as KProperty1<Any, Any?>
                        val o = transformToVO(k.get(v), key)
                        if (o != null || !vo.ignoreNull) {
                            val name = vo.name.ifEmpty { k.name }
                            root.put(name, o)
                        }
                    }
                }
                root
            }
            is IntEnum -> {
                v.value
            }
            else -> v
        }
    }

    fun toVO(key: String? = null): JsonObject {
        return transformToVO(this, key) as? JsonObject? ?: JsonObject()
    }
}
