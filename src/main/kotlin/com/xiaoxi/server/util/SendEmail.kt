package com.xiaoxi.server.util

import com.xserver.core.MainServer
import com.xserver.core.MainServer.Companion.vertx
import com.xserver.core.fiber.await
import io.vertx.ext.mail.MailClient
import io.vertx.ext.mail.MailConfig
import io.vertx.ext.mail.MailMessage
import io.vertx.ext.mail.StartTLSOptions

object SendEmail {

    suspend fun sendRegister(email: String, url: String): EMailRet {
        val html = """
            <meta charset="utf-8">
            <p>点击此链接来验证你的邮箱地址：</p>
            <p>$url</p>
            <br>
            <p>PaimonDB|计算器</p>
        """.trimIndent()
        return sendEMail(email, "PaimonDB|计算器", html)
    }

    data class EMailRet(val error: String? = null, val result: Any? = null)

    private suspend fun sendEMail(to: String, subject: String, htmlContent: String): EMailRet {
        val config = MailConfig()
        config.hostname = "smtpdm.aliyun.com"
        config.port = 465
        config.starttls = StartTLSOptions.OPTIONAL
        config.username = "noreply@mail.moyegame.com"
        config.password = "Xiaoxi123Mycsoft"
        config.isSsl = true
        val mailClient: MailClient = MailClient.createShared(vertx, config)

        val message = MailMessage()
        message.from = "noreply@mail.moyegame.com"
        message.setTo(to)
        message.subject = subject
        message.html = htmlContent

        val resp = mailClient.sendMail(message).await()
        if (resp.failed()) {
            val reason = "邮件发送失败（" + to + "），原因 ：" + resp.cause().message
            MainServer.log.info(reason)
            return EMailRet(reason)
        }
        return EMailRet(result = "")
    }
}