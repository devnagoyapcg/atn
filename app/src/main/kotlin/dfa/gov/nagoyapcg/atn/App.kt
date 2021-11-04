package dfa.gov.nagoyapcg.atn

import com.intellisrc.core.Config
import com.intellisrc.core.Log
import com.intellisrc.core.SysInfo
import com.intellisrc.core.SysService
import com.intellisrc.db.Database
import com.intellisrc.thread.ServiceTask
import com.intellisrc.web.WebService
import dfa.gov.nagoyapcg.atn.db.AtnDB
import dfa.gov.nagoyapcg.atn.db.UsersDB
import dfa.gov.nagoyapcg.atn.socket.SystemWebSocket
import dfa.gov.nagoyapcg.atn.webservices.AuthService
import dfa.gov.nagoyapcg.atn.webservices.WebUIServices
import java.time.LocalDateTime
import java.util.*


class App : SysService() {

    override fun onStart() {
        AtnDB.initDB()

        var port = Config.getInt("web.port")
        if (!args.isEmpty())
            port = Integer.parseInt(args.poll())
        webService.port = port
        webService.setResources(SysInfo.getFile("resources", "public"))
        webService.add(AuthService())
        webService.add(WebUIServices())
        webService.start(true)

        val keepAlive = true
        val web = WebService()
        web.port = 8080
        web.setResources(SysInfo.getFile("resources", "public"))
        web.cacheTime = 60
        web.addService(SystemWebSocket())
        web.start(keepAlive)
        if (web.isRunning)
            Log.i("Web service is running!")
        executeOnEveryMidnight()
    }

    override fun onStop() {
        webService.stop()

        Database.getDefault().quit()
    }

    companion object {
        private val webService = WebService()
        init {
            service = App()
        }
        private fun executeOnEveryMidnight() {
            ServiceTask.create({
                val timer = Timer()
                val hourlyTask: TimerTask = object : TimerTask() {
                    override fun run() {
                        val now = LocalDateTime.now()
                        if (now.hour <= 0 && now.minute <= 0 && now.second <= 0) {
                            logoutEveryone()
                        }
                    }
                }
                // schedule the task to run starting now and then every hour...
                timer.schedule(hourlyTask, 0L, 1000 * 60 * 60)
            }, "logout")
        }
        private fun logoutEveryone() {
            Log.i("Executed all user logout policy on midnight time.")
            val db = Database.getDefault().connect()
            UsersDB.superGetAll().forEach {
                db.table(AuthService.authTable).key("user").update(mapOf("status" to 0), it.user)
            }
            db.close()
        }
    }
}