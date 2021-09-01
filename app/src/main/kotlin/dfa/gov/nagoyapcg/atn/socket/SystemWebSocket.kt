package dfa.gov.nagoyapcg.atn.socket

import com.google.gson.Gson
import com.intellisrc.core.Log
import com.intellisrc.crypt.hash.PasswordHash
import com.intellisrc.db.DB
import com.intellisrc.db.Database
import com.intellisrc.web.ServiciableWebSocket
import com.intellisrc.web.Session
import com.intellisrc.web.WebSocketService
import dfa.gov.nagoyapcg.atn.webservices.AuthService
import java.net.InetAddress
import kotlin.random.Random

class SystemWebSocket : ServiciableWebSocket {
    override fun getPath(): String {
        return "/system"
    }

    override fun getAllowOrigin(): String {
        return ""
    }

    override fun getReplaceOnDuplicate(): Boolean {
        return false
    }

    override fun isReplaceOnDuplicate(): Boolean {
        return false
    }

    override fun setReplaceOnDuplicate(replaceOnDuplicate: Boolean) {
        TODO("Not yet implemented")
    }

    override fun setBroadCaster(msgBroadCaster: WebSocketService.MsgBroadCaster?) { }

    override fun getUserID(params: MutableMap<String, MutableList<String>>?, remoteIP: InetAddress?): String {
        var sessionID = ""
        sessionID = if(params != null && params.containsKey("user")) {
            params["user"]?.first()!!
        } else {
            remoteIP?.hostAddress +(Random.nextInt(100) + 1)
        }
        return sessionID
    }

    override fun onConnect(session: Session?): ServiciableWebSocket.WSMessage {
        return ServiciableWebSocket.WSMessage(mapOf("ok" to true, "status" to "connected"))
    }

    override fun onDisconnect(session: Session?, statusCode: Int, reason: String?): ServiciableWebSocket.WSMessage {
        return ServiciableWebSocket.WSMessage("", emptyMap<String, Any>())
    }

    // TODO: find a way to get the user's ip address
    override fun onMessage(session: Session?, message: String?): ServiciableWebSocket.WSMessage {
        var level = AuthService.Level.GUEST
        var ok = false
        val data = gson.fromJson(message, Map::class.java)
        when (data["request"]) {
            "login" -> {
                val json = gson.fromJson(data["data"].toString(), Map::class.java)
                val user = json["user"].toString()
                val pass = json["pass"].toString().toCharArray()
                if (pass.isNotEmpty()) {
                    val db: DB = Database.getDefault().connect()
                    val hash = db.table("auth").field("pass").key("user")[user].toString() //.field("pass").key("user")[user].toString()
                    db.close()
                    if (hash.isNotEmpty()) {
                        val ph = PasswordHash()
                        ph.setPassword(*pass)
                        val login = ph.verify(hash)
                        if (login) {
                            level = AuthService.Level.ADMIN
                            //Log.s("[%s] logged in as %s", request.ip(), user)
                            Log.i("logged in as %s", user)
                        } else {
                            //Log.s("[%s] Provided password is incorrect. Hash: [%s]", request.ip(), ph.BCryptNoHeader())
                            Log.w("Provided password is incorrect. Hash: [%s]", ph.BCryptNoHeader())
                        }
                    } else {
                        //Log.s("[%s] User %s not found.", request.ip(), user)
                        Log.w("User %s not found.", user)
                    }
                } else {
                    //Log.s("[%s] Password was empty", request.ip(), user)
                    Log.w("password was empty", user)
                }
            }
            "logout" -> {

            }
        }
        Log.i(data.toString())
        return ServiciableWebSocket.WSMessage(mapOf("ok" to ok))
    }

    override fun onClientsChange(list: MutableList<String>?) { }

    override fun onError(session: Session?, message: String?) { }

    override fun sendMessageTo(userID: String?, data: MutableMap<Any?, Any?>?): Boolean {
        return false
    }

    override fun getBroadCaster(): WebSocketService.MsgBroadCaster {
        return WebSocketService.MsgBroadCaster { message, onSuccess, onFail ->  }
    }

    companion object {
        val gson = Gson()
    }
}