package dfa.gov.nagoyapcg.atn.webservices

import com.intellisrc.core.Log
import com.intellisrc.crypt.hash.PasswordHash
import com.intellisrc.db.DB
import com.intellisrc.db.Database
import com.intellisrc.web.JSON
import com.intellisrc.web.Service.Allow
import com.intellisrc.web.ServiciableAuth
import spark.Request
import spark.Response

class AuthService : ServiciableAuth {
    enum class Level {
        GUEST, USER, ADMIN
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
        val post = json["post"].toString()
        if (pass.isNotEmpty()) {
            val db: DB = Database.getDefault().connect()
            val hash = db.table(authTable).field("pass").key("user")[user].toString()
            db.close()
            if (hash.isNotEmpty()) {
                val ph = PasswordHash()
                ph.setPassword(*pass)
                val login = ph.verify(hash)
                if (login) {
                    level = if (user == "admin")
                        Level.ADMIN
                    else
                        Level.USER
                    map["user"] = user
                    map["level"] = level
                    map["post"] = post
                    map["ip"] = request?.ip()!!
                    Log.i("[%s] logged in as %s", request.ip(), user)
                } else {
                    Log.w("[%s] Provided password is incorrect. Hash: [%s]", request?.ip(), ph.BCryptNoHeader())
                }
            } else {
                Log.w("[%s] User %s not found.", request?.ip(), user)
            }
        } else {
            Log.w("[%s] Password was empty", request?.ip(), user)
        }
        if (level == Level.GUEST)
            response?.status(401)
        return map
    }

    override fun onLogout(request: Request?, response: Response?): Boolean {
        var ok = false
        if (request!!.session() != null) {
            request.session().invalidate()
            ok = true
        } else {
            Log.w("[%s] Session was empty", request.ip())
        }
        Log.w("[%s] logged out", request.ip())
        return ok
    }

    companion object {
        const val authTable = "auth"

        fun getUserLevel(request: Request?): Level {
            return if (request?.session()?.attribute<Level?>("level")?.toString()?.uppercase() == "ADMIN") {
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
                    return@Allow request.ip() == request.session().attribute("ip") && Level.valueOf(request.session().attribute<Any>("level").toString().uppercase()) == Level.ADMIN || request.ip() == request.session().attribute("ip") && Level.valueOf(request.session().attribute<Any>("level").toString().uppercase()) == Level.USER
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