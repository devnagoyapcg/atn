package dfa.gov.nagoyapcg.atn.webservices

import com.intellisrc.core.Log
import com.intellisrc.crypt.hash.PasswordHash
import com.intellisrc.db.DB
import com.intellisrc.db.Database
import com.intellisrc.web.JSON
import com.intellisrc.web.Service.Allow
import com.intellisrc.web.ServiciableAuth
import dfa.gov.nagoyapcg.atn.db.models.LoginStatusModel
import spark.Request
import spark.Response
import java.util.concurrent.ConcurrentHashMap

class AuthService : ServiciableAuth {
    enum class Level {
        GUEST, USER, ADMIN, SUPER
    }

    override fun getPath(): String {
        return "/auth"
    }

    override fun getAllowOrigin(): String {
        return ""
    }

    override fun getLoginPath(): String {
        return "/login"
    }

    override fun getLogoutPath(): String {
        return "/logout"
    }

    override fun onLogin(request: Request?, response: Response?): MutableMap<String, Any> {
        var level = Level.GUEST
        val map = HashMap<String, Any>()
        val json = JSON.decode(request?.body()).toMap()
        val user = json["user"].toString()
        val pass = json["pass"].toString().toCharArray()
        if (pass.isNotEmpty()) {
            val db: DB = Database.getDefault().connect()
            val hash = db.table(authTable).field("pass").key("user")[user].toString()
            if (db.table(authTable).field("status").key("user")[user].toString() == "1") {
                Log.i("user $user already logged in")
                //db.table("auth").key("user").update(mapOf("status" to 0), "sem")
                //db.table("auth").key("user").update(mapOf("status" to 0), "admin")
                //db.table("auth").key("user").update(mapOf("status" to 0), "superadministrator")
                response?.status(409)
                return map
            } else {
                if (hash.isNotEmpty()) {
                    val ph = PasswordHash()
                    ph.setPassword(*pass)
                    val login = ph.verify(hash)
                    if (login) {
                        level = when (user) {
                            "superadministrator" -> Level.SUPER
                            "admin" -> Level.ADMIN
                            else -> Level.USER
                        }
                        db.table(authTable).key("user").update(mapOf("status" to 1), user)
                        map["user"] = user
                        map["level"] = level
                        map["ip"] = request?.ip()!!
                        mapLogin[user] = LoginStatusModel(request.ip(), user, level, request.session())
                        Log.i("[%s] logged in as %s", request.ip(), user)
                    } else {
                        Log.w("[%s] Provided password is incorrect. Hash: [%s]", request?.ip(), ph.BCryptNoHeader())
                    }
                } else {
                    Log.w("[%s] User %s not found.", request?.ip(), user)
                }
            }
            db.close()
        } else {
            Log.w("[%s] Password was empty", request?.ip(), user)
        }
        if (level == Level.GUEST)
            response?.status(401)
        return map
    }

    override fun onLogout(request: Request?, response: Response?): Boolean {
        var ok = false
        val user = request?.session()?.attribute<Any>("user")?.toString()
        if (request!!.session() != null) {
            mapLogin.remove(user)
            ok = true
        } else {
            Log.w("[%s] Session was empty", request.ip())
        }
        Log.w("[%s] logged out", request.ip())
        return ok
    }

    companion object {
        const val authTable = "auth"
        val mapLogin: ConcurrentHashMap<String, Any> = ConcurrentHashMap()

        fun getUserLevel(request: Request?): Level {
            return if (request?.session()?.attribute<Level?>("level")?.toString()?.uppercase() == "SUPER") {
                Log.i("${request.session()?.attribute<Level?>("level")}")
                Level.SUPER
            } else if (request?.session()?.attribute<Level?>("level")?.toString()?.uppercase() == "ADMIN") {
                Log.i("${request.session()?.attribute<Level?>("level")}")
                Level.ADMIN
            } else if (request?.session()?.attribute<Level?>("level")?.toString()?.uppercase() == "USER") {
                Log.i("${request.session()?.attribute<Level?>("level")}")
                Level.USER
            } else
                Level.GUEST
        }
        fun Admin() = Allow { request ->
            if (request.session() != null) {
                try {
                    return@Allow request.ip() == request.session().attribute("ip") && Level.valueOf(request.session().attribute<Any>("level").toString().uppercase()) == Level.SUPER ||
                            request.ip() == request.session().attribute("ip") && Level.valueOf(request.session().attribute<Any>("level").toString().uppercase()) == Level.ADMIN ||
                            request.ip() == request.session().attribute("ip") && Level.valueOf(request.session().attribute<Any>("level").toString().uppercase()) == Level.USER
                } catch (e: Exception) {
                    Log.e("Error during authorization", e)
                    return@Allow false
                }
            } else {
                return@Allow false
            }
        }
    }
}