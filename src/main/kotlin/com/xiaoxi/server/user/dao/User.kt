package com.xiaoxi.server.user.dao

import com.xiaoxi.server.base.BoolState
import com.xiaoxi.server.base.DaoTable
import com.xiaoxi.server.base.VO
import com.xiaoxi.server.base.ToVO
import com.xiaoxi.server.user.LoginSession
import com.xserver.auth.AuthUser
import com.xserver.mongo.*
import io.vertx.core.json.JsonObject

class User(raw: JsonObject = JsonObject()) : MongoDBObject(raw), AuthUser, ToVO {
    companion object : DaoTable {
        const val LIST_VO = "list"

        //超级管理员
        const val SuperID = 1

        override suspend fun createIndex() {
            MongoClient.def.createIndex(User::class) {
                addIndex(User::id to 1).unique = true
                addIndex(User::username to 1).unique = true
            }.exec()
        }

        suspend fun getByID(id: Int): User? {
            return MongoClient.def.query(User::class) {
                where(User::id eq id)
            }.findOneObject()
        }

        suspend fun getByUserName(adminName: String): User? {
            return MongoClient.def.query(User::class) {
                where(User::username eq adminName)
                excludeID()
            }.findOneObject()
        }

        suspend fun getUserMap(ids: List<Int>): Map<Int, String> {
            return MongoClient.def.query(User::class) {
                where(User::id isIn ids)
                excludeID()
                select(User::id, User::name)
            }.find().associate { it.getInteger(User::id.dbName) to it.getString(User::name.dbName) }
        }
    }

    @PrimaryKey
    @VO
    var id by IntField

    /** 帐号 */
    @VO(voKeys = [LIST_VO])
    var username by StringField

    /** 密码 */
    var password by StringField

    /** 显示名称 */
    @VO
    var name by StringField

    /** 状态 */
    @VO(voKeys = [LIST_VO])
    var enable by EnumField(BoolState::class)

    /** 所属权限分组 */
    @VO(voKeys = [LIST_VO])
    var roleId by IntField

    /** 创建时间 */
    @VO(voKeys = [LIST_VO])
    var createTime by LongField

    /** 本次登录的jwt信息 */
    var session: LoginSession? = null

    override val isSuperAdmin: Boolean
        get() {
            return hasRole(SuperID.toString())
        }

    override fun hasRole(role: String): Boolean {
        return roleId.toString() == role
    }
}
