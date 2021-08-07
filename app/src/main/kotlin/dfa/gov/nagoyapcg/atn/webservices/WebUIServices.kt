package dfa.gov.nagoyapcg.atn.webservices

import com.google.gson.Gson
import com.intellisrc.core.Log
import com.intellisrc.web.JSON
import com.intellisrc.web.Service
import com.intellisrc.web.ServiciableMultiple
import dfa.gov.nagoyapcg.atn.db.AtnDB
import dfa.gov.nagoyapcg.atn.db.models.CaseModel
import groovy.lang.Closure
import spark.Request
import spark.Response
import java.io.File
import java.util.LinkedHashMap

class WebUIServices : ServiciableMultiple {
    override fun getPath(): String {
        return "/atn"
    }

    override fun getAllowOrigin(): String {
        return ""
    }

    override fun getServices(): MutableList<Service> {
        val services: MutableList<Service> = ArrayList()
        services.add(onLoggedIn())
        services.add(onSuccessLogout())
        services.add(onSuperAdmin())
        services.add(getAll())
        services.add(onSaveNewCase())
        services.add(onSaveEditing())
        return services
    }

    companion object {
        private val gson = Gson()

        fun onLoggedIn(): Service {
            val service = Service()
            service.method = Service.Method.POST
            service.path = "/page"
            service.action = object : Closure<LinkedHashMap<String?, Boolean?>?>(this, this) {
                fun doCall(request: Request): LinkedHashMap<String, Any> {
                    val page = if (AuthService.getUserLevel(request) == AuthService.Level.ADMIN)
                        "admin.html"
                    else
                        "/"
                    val map = LinkedHashMap<String, Any>(1)
                    mapOf("page" to page)
                    map["page"] = page
                    return map
                }
            }
            return service
        }
        fun onSuccessLogout(): Service {
            val service = Service()
            service.method = Service.Method.GET
            service.path = "/logout"
            service.action = Service.Action {
                val page = "/"
                mapOf("page" to page)
            }
            return service
        }
        fun onSuperAdmin(): Service {
            val service = Service()
            service.method = Service.Method.GET
            service.contentType = "text/html"
            service.path = "/super"
            service.action = Service.Action {
                File("resources/public/private/", "super.html")
            }
            return service
        }
        fun getAll(): Service {
            val service = Service()
            service.method = Service.Method.GET
            service.allow = AuthService.Admin()
            service.path = "/load"
            service.action = object : Closure<LinkedHashMap<String?, Boolean?>?>(this, this) {
                fun doCall(request: Request): LinkedHashMap<String, Any> {
                    val map = LinkedHashMap<String, Any>(1)
                    map["data"] = AtnDB.getAll()
                    return map
                }
            }
            return service
        }
        fun onSaveNewCase(): Service {
            val service = Service()
            var ok = false
            service.method = Service.Method.POST
            service.allow = AuthService.Admin()
            service.path = "/add"
            service.action = object : Closure<LinkedHashMap<String?, Boolean?>?>(this, this) {
                fun doCall(request: Request, response: Response): LinkedHashMap<String, Any> {
                    val json = JSON.decode(request.body()).toMap()
                    if (request.body().trim().isNotEmpty()) {
                        val caseModel = gson.fromJson(request.body().trim(), CaseModel::class.java)
                        ok = AtnDB.saveNewCase(caseModel)
                    }
                    val map = LinkedHashMap<String, Any>(1)
                    map["ok"] = ok
                    return map
                }
            }
            return service
        }
        fun onSaveEditing(): Service {
            val service = Service()
            service.method = Service.Method.POST
            service.allow = AuthService.Admin()
            service.path = "/edit"
            service.action = object : Closure<LinkedHashMap<String?, Boolean?>?>(this, this) {
                fun doCall(request: Request, response: Response): LinkedHashMap<String, Any> {
                    val caseModel = gson.fromJson(request.body().trim(), CaseModel::class.java)
                    val ok = AtnDB.saveEditing(caseModel)
                    val map = LinkedHashMap<String, Any>(1)
                    map["ok"] = ok
                    return map
                }
            }
            return service
        }
    }
}