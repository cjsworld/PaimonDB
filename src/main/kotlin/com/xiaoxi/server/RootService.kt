package com.xiaoxi.server

import com.xiaoxi.server.relic.RelicService
import com.xiaoxi.server.rpcLog.RPCLogService
import com.xiaoxi.server.system.SystemService
import com.xiaoxi.server.user.AuthImpl
import com.xiaoxi.server.user.Permissions
import com.xiaoxi.server.user.UserService
import com.xiaoxi.server.util.JwtES256Util
import com.xserver.auth.AuthControllerManager
import com.xserver.auth.AuthManager
import com.xserver.core.MainServer
import com.xserver.core.Service
import com.xserver.core.fiber.LockerManager
import com.xserver.core.http.HttpServer
import com.xserver.core.http.RoutingHttpHandler
import com.xserver.core.util.isValid
import com.xserver.mongo.MongoClient
import io.vertx.core.VertxOptions
import io.vertx.core.http.HttpServerOptions

fun main(args: Array<String>) {
    MainServer.main(args, RootService)
}

object RootService : Service, MainServer.Factory {
    override fun createRootService() = RootService
    override fun vertxOptions(): VertxOptions {
        return super.vertxOptions().setEventLoopPoolSize(1)
    }

    val locker = LockerManager()
    lateinit var mongo: MongoClient
    lateinit var http: HttpServer

    val auth = AuthManager(AuthImpl())
    val ctrl = AuthControllerManager(auth)

    lateinit var jwt: JwtES256Util
    lateinit var webUrl: String

    override suspend fun init() {
        val dbName = MainServer.config.getString("Name")
        MainServer.log.info("数据库：$dbName")
        mongo = MongoClient.connect(MainServer.config.getJsonObject("Mongo"), dbName)
        mongo.createTableIDIndex()
        MongoClient.defInsGetter = { mongo }

        jwt = JwtES256Util(privateKeyAES = "8ws12d685aed5795", privateKeyIv = "6874820e56934po9")
        Permissions.buildTree(auth)
        val op = HttpServerOptions()
        op.isCompressionSupported = true
        op.isDecompressionSupported = true
        http = HttpServer(MainServer.config.getInteger("Port"), op)
        http.addVueRouter("/")
        http.addHttpHandler(RoutingHttpHandler("/api", ctrl))

        webUrl = MainServer.config.getString("WebUrl").isValid("WebUrl未配置")

        MainServer.addSvc(SystemService)
        MainServer.addSvc(UserService)
        MainServer.addSvc(RPCLogService)

        MainServer.addSvc(RelicService)
    }

    override suspend fun onOpen() {
        http.open()
    }

    override suspend fun onStop() {
        http.close()
        mongo.close()
    }
}
