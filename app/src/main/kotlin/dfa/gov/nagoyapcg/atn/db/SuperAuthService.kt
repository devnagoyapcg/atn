package dfa.gov.nagoyapcg.atn.db

import com.google.gson.Gson
import com.intellisrc.core.Log
import com.intellisrc.crypt.hash.PasswordHash
import com.intellisrc.db.DB
import com.intellisrc.db.Database
import com.intellisrc.db.Query
import com.intellisrc.web.ServiciableAuth
import spark.Request
import spark.Response

class SuperAuthService : ServiciableAuth {
    init {
        if (checkIfTableExist()) {
            Log.i("Super table exist!")
        } else
            Log.i("Super table will be created")
    }
    override fun getPath(): String {
        return "/super"
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
        val map = HashMap<String, Any>()
        val json = gson.fromJson(request?.body().toString(), Map::class.java)
        val user = json["user"].toString()
        val pass = json["pass"].toString().toCharArray()
        if (pass.isNotEmpty()) {
            val db: DB = Database.getDefault().connect()
            val hash = db.table(table).field("pass").key("user")[user].toString()
            db.close()
            if (hash.isNotEmpty()) {
                val ph = PasswordHash()
                ph.setPassword(*pass)
                val login = ph.verify(hash)
                if (login) {
                    map["user"] = user
                    map["ip"] = request?.ip()!!
                    Log.i("[%s] logged in as %s", request.ip(), user)
                } else
                    Log.w("[%s] provided password is incorrect. Hash: [%s]", request?.ip(), ph.BCryptNoHeader())
            } else
                Log.w("[%s] user %s not found.", request?.ip(), user)
        } else
            Log.w("[%s] password was emtpy.", request?.ip(), user)
        return map
    }

    override fun onLogout(request: Request?, response: Response?): Boolean {
        var ok = false
        if (request!!.session() != null) {
            request.session().invalidate()
            ok = true
        } else
            Log.w("[%s] session was empty.", request.ip())
        Log.w("[%s] logged out", request.ip())
        return ok
    }

    companion object {
        private const val table = "super"
        private val gson = Gson()
        fun checkIfTableExist(): Boolean {
            var ok = false
            val db: DB = Database.getDefault().connect()
            if (!db.table(table).exists())
                db.exec(Query("CREATE TABLE $table (`user` VARCHAR(100) NOT NULL, `pass` VARCHAR(100) NOT NULL)"))
            else
                ok = true
            db.close()
            return ok
        }
    }
}