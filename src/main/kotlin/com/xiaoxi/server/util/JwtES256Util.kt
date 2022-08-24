package com.xiaoxi.server.util

import com.auth0.jwt.JWT
import com.auth0.jwt.JWTCreator
import com.auth0.jwt.JWTVerifier
import com.auth0.jwt.algorithms.Algorithm
import com.auth0.jwt.interfaces.DecodedJWT
import com.xserver.core.MainServer
import io.vertx.core.buffer.Buffer
import org.bouncycastle.jce.provider.BouncyCastleProvider
import java.security.*
import java.security.interfaces.ECPrivateKey
import java.security.interfaces.ECPublicKey
import java.security.spec.ECGenParameterSpec
import java.security.spec.PKCS8EncodedKeySpec
import java.security.spec.X509EncodedKeySpec
import java.util.Date
import javax.crypto.Cipher
import javax.crypto.spec.IvParameterSpec
import javax.crypto.spec.SecretKeySpec


//gradle dependencies:
//implementation 'com.auth0:java-jwt:3.19.2'
//implementation 'org.bouncycastle:bcprov-jdk15on:1.70'


class JwtES256Util(
    publicKeyPath: String = "${MainServer.runtimePath}ec_public.der",
    privateKeyPath: String = "${MainServer.runtimePath}ec_private.der",
    privateKeyAES: String? = null,
    privateKeyIv: String? = null
) {
    private val publicKey: ECPublicKey
    private val privateKey: ECPrivateKey
    private val algorithm: Algorithm
    private val verifier: JWTVerifier

    init {
        Security.addProvider(BouncyCastleProvider())
        var keyPair = try {
            loadKey(publicKeyPath, privateKeyPath, privateKeyAES, privateKeyIv)
        } catch (e: Throwable) {
            throw Exception("加载Jwt密钥失败", e)
        }
        if (keyPair == null) {
            keyPair = try {
                genKey(publicKeyPath, privateKeyPath, privateKeyAES, privateKeyIv)
            } catch (e: Throwable) {
                throw Exception("生成Jwt密钥失败", e)
            }
        }
        publicKey = keyPair!!.public as ECPublicKey
        privateKey = keyPair.private as ECPrivateKey
        algorithm = Algorithm.ECDSA256(publicKey, privateKey)
        verifier = JWT.require(algorithm).apply {
//            acceptLeeway(1)
//            acceptExpiresAt(5)
        }.build()
    }

    private fun loadKey(publicKeyPath: String, privateKeyPath: String, privateKeyAES: String?, privateKeyIv: String?): KeyPair? {
        val kf = KeyFactory.getInstance("ECDSA")
        val fs = MainServer.vertx.fileSystem()
        return if (fs.existsBlocking(publicKeyPath) && fs.existsBlocking(privateKeyPath)) {
            val pubBuf = fs.readFileBlocking(publicKeyPath)!!.bytes
            val pub = kf.generatePublic(X509EncodedKeySpec(pubBuf))

            var priBuf = fs.readFileBlocking(privateKeyPath)!!.bytes!!
            if (privateKeyAES != null && privateKeyIv != null) {
                priBuf = decryptAES(priBuf, privateKeyAES, privateKeyIv)
            }
            val pri = kf.generatePrivate(PKCS8EncodedKeySpec(priBuf))
            KeyPair(pub, pri)
        } else {
            null
        }
    }

    private fun genKey(publicKeyPath: String, privateKeyPath: String, privateKeyAES: String?, privateKeyIv: String?): KeyPair {
        val kpg = KeyPairGenerator.getInstance("ECDSA")
        kpg.initialize(ECGenParameterSpec("prime256v1"), SecureRandom())
        val keyPair = kpg.generateKeyPair()
        val fs = MainServer.vertx.fileSystem()
        fs.writeFileBlocking(publicKeyPath, Buffer.buffer(keyPair.public.encoded))
        var priBuf = keyPair.private.encoded
        if (privateKeyAES != null && privateKeyIv != null) {
            priBuf = encryptAES(priBuf, privateKeyAES, privateKeyIv)
        }
        fs.writeFileBlocking(privateKeyPath, Buffer.buffer(priBuf))
        MainServer.log.info("生成新Jwt密钥：$publicKeyPath, $privateKeyPath")
        return keyPair
    }

    private fun encryptAES(data: ByteArray, key: String, iv: String): ByteArray {
        val cipher = Cipher.getInstance("AES/CBC/PKCS5Padding")
        val keySpec = SecretKeySpec(key.toByteArray(), "AES")
        val ivSpec = IvParameterSpec(iv.toByteArray())
        cipher.init(Cipher.ENCRYPT_MODE, keySpec, ivSpec)
        return cipher.doFinal(data)
    }

    private fun decryptAES(data: ByteArray, key: String, iv: String): ByteArray {
        val cipher = Cipher.getInstance("AES/CBC/PKCS5Padding")
        val keySpec = SecretKeySpec(key.toByteArray(), "AES")
        val ivSpec = IvParameterSpec(iv.toByteArray())
        cipher.init(Cipher.DECRYPT_MODE, keySpec, ivSpec)
        return cipher.doFinal(data)
    }

    fun sign(issuedAt: Long? = null, expiresAt: Long? = null, param: Map<String, Any>? = null): String {
        return JWT.create().apply {
            issuedAt?.also { withIssuedAt(Date(it * 1000)) }
            expiresAt?.also { withExpiresAt(Date(it * 1000)) }
            param?.also { withPayload(it) }
        }.sign(algorithm)
    }

    fun sign(jwt: JWTCreator.Builder): String {
        return jwt.sign(algorithm)
    }

    fun verify(jwt: String): DecodedJWT {
        return verifier.verify(jwt)
    }

    fun verifyOrNull(jwt: String): DecodedJWT? {
        return try {
            verifier.verify(jwt)
        } catch (e: Throwable) {
            null
        }
    }
}