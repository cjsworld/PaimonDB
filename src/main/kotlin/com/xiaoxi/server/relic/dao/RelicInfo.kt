package com.xiaoxi.server.relic.dao

import com.xiaoxi.server.base.DaoTable
import com.xiaoxi.server.base.ToVO
import com.xiaoxi.server.base.VO
import com.xserver.core.Alias
import com.xserver.mongo.MongoClient
import com.xserver.mongo.MongoDBObject
import com.xserver.mongo.eq
import io.vertx.core.json.JsonObject
import kotlin.math.abs

@Alias("Relic")
class RelicInfo(root: JsonObject = JsonObject()) : MongoDBObject(root), ToVO {

    companion object : DaoTable {
        override suspend fun createIndex() {
            MongoClient.def.createIndex(RelicInfo::class) {
                addIndex(RelicInfo::userId to 1, RelicInfo::id to 1).unique = true
                addIndex(RelicInfo::userId to 1, RelicInfo::modifyTime to -1)
            }.exec()
        }

        suspend fun getUserRelicMaxId(uid: Int): Int {
            return MongoClient.def.query(RelicInfo::class) {
                where(RelicInfo::userId eq uid)
                sort(RelicInfo::id, -1)
            }.findOneObject<RelicInfo>()?.id ?: 0
        }

        suspend fun getUserRelicMaxModifyTime(uid: Int): Long {
            return MongoClient.def.query(RelicInfo::class) {
                where(RelicInfo::userId eq uid)
                sort(RelicInfo::modifyTime, -1)
            }.findOneObject<RelicInfo>()?.modifyTime ?: 0L
        }

        suspend fun getUserAllRelic(uid: Int): List<RelicInfo> {
            return MongoClient.def.query(RelicInfo::class) {
                where(RelicInfo::userId eq uid)
                sort(RelicInfo::id, 1)
            }.findObject()
        }
    }

    @PrimaryKey
    var userId by IntField

    @VO
    @PrimaryKey
    var id by IntField

    /** 套装ID */
    @VO
    var setId by IntField

    /** 星级 */
    @VO
    var rank by IntField

    /** 槽位 */
    @VO
    var slotIndex by IntField

    /** 等级 */
    @VO
    var level by IntField

    /** 主属性类型 */
    @VO
    var mainPropTypeId by StringField

    /** 副词条1类型 */
    @VO
    var subProp1TypeId by StringField
    /** 副词条1数值 */
    @VO
    var subProp1Value by DoubleField

    /** 副词条2类型 */
    @VO
    var subProp2TypeId by StringField
    /** 副词条2数值 */
    @VO
    var subProp2Value by DoubleField

    /** 副词条3类型 */
    @VO
    var subProp3TypeId by StringField
    /** 副词条3数值 */
    @VO
    var subProp3Value by DoubleField

    /** 副词条4类型 */
    @VO
    var subProp4TypeId by StringField
    /** 副词条4数值 */
    @VO
    var subProp4Value by DoubleField

    /** 已被装备到的角色 */
    @VO
    var equippedAvatar by IntField.Nullable

    /** 修改时间 */
    @VO
    var modifyTime by LongField

    fun fromClient(json: JsonObject): RelicInfo {
        if (json.containsKey("id")) {
            id = json.getInteger("id")
        }
        setId = json.getInteger("setId")
        rank = json.getInteger("rank")
        slotIndex = json.getInteger("slotIndex")
        level = json.getInteger("level")
        mainPropTypeId = json.getString("mainPropTypeId")
        subProp1TypeId = json.getString("subProp1TypeId")
        subProp1Value = json.getDouble("subProp1Value")
        subProp2TypeId = json.getString("subProp2TypeId")
        subProp2Value = json.getDouble("subProp2Value")
        subProp3TypeId = json.getString("subProp3TypeId")
        subProp3Value = json.getDouble("subProp3Value")
        subProp4TypeId = json.getString("subProp4TypeId")
        subProp4Value = json.getDouble("subProp4Value")
        equippedAvatar = json.getInteger("equippedAvatar")
        return this
    }

    override fun equals(other: Any?): Boolean {
        if (other !is RelicInfo) {
            return false
        }
        fun doubleEquals(a: Double, b: Double): Boolean {
            return abs(a - b) < 0.000001
        }
        if (userId != other.userId) return false
        if (rank != other.rank) return false
        if (slotIndex != other.slotIndex) return false
        if (level != other.level) return false
        if (mainPropTypeId != other.mainPropTypeId) return false

        if (subProp1TypeId != other.subProp1TypeId) return false
        if (!doubleEquals(subProp1Value, other.subProp1Value)) return false
        if (subProp2TypeId != other.subProp2TypeId) return false
        if (!doubleEquals(subProp2Value, other.subProp2Value)) return false
        if (subProp3TypeId != other.subProp3TypeId) return false
        if (!doubleEquals(subProp3Value, other.subProp3Value)) return false
        if (subProp4TypeId != other.subProp4TypeId) return false
        if (!doubleEquals(subProp4Value, other.subProp4Value)) return false
        return true
    }

    override fun hashCode(): Int {
        var result = userId
        result = 31 * result + setId
        result = 31 * result + rank
        result = 31 * result + slotIndex
        result = 31 * result + level
        result = 31 * result + mainPropTypeId.hashCode()
        result = 31 * result + subProp1TypeId.hashCode()
        result = 31 * result + subProp1Value.hashCode()
        result = 31 * result + subProp2TypeId.hashCode()
        result = 31 * result + subProp2Value.hashCode()
        result = 31 * result + subProp3TypeId.hashCode()
        result = 31 * result + subProp3Value.hashCode()
        result = 31 * result + subProp4TypeId.hashCode()
        result = 31 * result + subProp4Value.hashCode()
        return result
    }
}
