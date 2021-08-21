package dfa.gov.nagoyapcg.atn.webservices

import com.google.gson.Gson
import com.intellisrc.core.Log
import com.intellisrc.crypt.hash.PasswordHash
import com.intellisrc.etc.Bytes
import com.intellisrc.web.Service
import com.intellisrc.web.ServiciableMultiple
import dfa.gov.nagoyapcg.atn.db.AtnDB
import dfa.gov.nagoyapcg.atn.db.UsersDB
import dfa.gov.nagoyapcg.atn.db.models.CaseModel
import dfa.gov.nagoyapcg.atn.db.models.LinkModel
import dfa.gov.nagoyapcg.atn.db.models.UserModel
import groovy.lang.Closure
import spark.Request
import spark.Response
import java.io.File
import java.nio.file.Files

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
        services.add(deleteCase())
        services.add(getNpcgLogo())
        services.add(getUsers())
        services.add(createNewUser())
        services.add(updateUser())
        services.add(updatePassword())
        services.add(deleteUser())
        services.add(getUpload())
        services.add(getSupportingFiles())
        services.add(getUserLevel())
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
                    val page = if (AuthService.getUserLevel(request) == AuthService.Level.ADMIN || (AuthService.getUserLevel(request) == AuthService.Level.USER))
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
                    if (request.body().trim().isNotEmpty()) {
                        val caseModel = gson.fromJson(request.body().trim(), CaseModel::class.java)
                        caseModel.id = AtnDB.getLastID() + 1
                        Log.i("The last ID is ${AtnDB.getLastID()}")
                        ok = AtnDB.saveNewCase(caseModel)
                    }
                    val map = LinkedHashMap<String, Any>(1)
                    map["ok"] = ok
                    map["data"] = AtnDB.getAll()
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
                    map["data"] = AtnDB.getAll()
                    return map
                }
            }
            return service
        }
        fun deleteCase(): Service {
            val service = Service()
            service.method = Service.Method.DELETE
            service.allow = AuthService.Admin()
            service.path = "/delete/:id"
            service.action = object : Closure<LinkedHashMap<String?, Boolean?>?>(this, this) {
                fun doCall(request: Request): LinkedHashMap<String, Any> {
                    val id = Integer.parseInt(request.params("id"))
                    val ok = AtnDB.deleteCase(id)
                    val map = LinkedHashMap<String, Any>(1)
                    map["ok"] = ok
                    map["data"] = AtnDB.getAll()
                    return map
                }
            }
            return service
        }
        fun getNpcgLogo(): Service {
            val service = Service()
            service.path = "/npcg"
            service.contentType = "image/jpeg"
            service.action = Service.Action {
                File("resources/public/img/", "npcg.jpg")
            }
            return service
        }
        fun getUsers(): Service {
            val service = Service()
            service.method = Service.Method.GET
            service.allow = AuthService.Admin()
            service.path = "/users"
            service.action = object : Closure<LinkedHashMap<String?, Boolean?>?>(this, this) {
                fun doCall(request: Request): LinkedHashMap<String, Any> {
                    val map = LinkedHashMap<String, Any>(1)
                    map["data"] = UsersDB.getAll()
                    return map
                }
            }
            return service
        }
        fun createNewUser(): Service {
            val service = Service()
            service.method = Service.Method.POST
            service.allow = AuthService.Admin()
            service.path = "/new"
            service.action = object : Closure<LinkedHashMap<String?, Boolean?>?>(this, this) {
                fun doCall(request: Request): LinkedHashMap<String, Any> {
                    val map = LinkedHashMap<String, Any>(1)
                    val user = gson.fromJson(request.body().trim(), HashMap::class.java)
                    //val pass = Bytes.fromString(user["pass"].toString())
                    val pass = user["pass"].toString().toCharArray()
                    val hasher = PasswordHash()
                    hasher.setPassword(*pass)
                    val hash = hasher.BCrypt()
                    val ok = UsersDB.create(mapOf(
                        "user" to user["user"].toString(),
                        "pass" to hash,
                        "lastName" to user["lastName"].toString(),
                        "firstName" to user["firstName"].toString())
                    )
                    map["ok"] = ok
                    map["data"] = UsersDB.getAll()
                    return map
                }
            }
            return service
        }
        fun updateUser(): Service {
            val service = Service()
            service.method = Service.Method.POST
            service.allow = AuthService.Admin()
            service.path = "/update"
            service.action = object : Closure<LinkedHashMap<String?, Boolean?>?>(this, this) {
                fun doCall(request: Request): LinkedHashMap<String, Any> {
                    val userModel = gson.fromJson(request.body().trim(), UserModel::class.java)
                    val ok = UsersDB.update(userModel)
                    val map = LinkedHashMap<String, Any>(1)
                    map["ok"] = ok
                    map["data"] = UsersDB.getAll()
                    return map
                }
            }
            return service
        }
        fun updatePassword(): Service {
            val service = Service()
            service.method = Service.Method.POST
            service.allow = AuthService.Admin()
            service.path = "/pass"
            service.action = object : Closure<LinkedHashMap<String?, Boolean?>?>(this, this) {
                fun doCall(request: Request): LinkedHashMap<String, Any> {
                    val data = gson.fromJson(request.body().toString(), HashMap::class.java)
                    val pass = Bytes.fromString(data["pass"].toString())
                    val hasher = PasswordHash()
                    hasher.setPassword(*pass.toString().toCharArray())
                    val hash = hasher.BCrypt()
                    val ok = UsersDB.updatePass(data["id"].toString().toInt(), hash)
                    val map = LinkedHashMap<String, Any>(1)
                    map["ok"] = ok
                    map["data"] = UsersDB.getAll()
                    return map
                }
            }
            return service
        }
        fun deleteUser(): Service {
            val service = Service()
            service.method = Service.Method.POST
            service.allow = AuthService.Admin()
            service.path = "/deleteuser/:id"
            service.action = object : Closure<LinkedHashMap<String?, Boolean?>?>(this, this) {
                fun doCall(request: Request): LinkedHashMap<String, Any> {
                    val id = Integer.parseInt(request.params("id"))
                    var ok = false
                    Log.i("id is %d", id)
                    if (id != 0 || id != 1) { // FIXME: why this check doesn't work?
                        //ok = UsersDB.deleteUser(id)
                        Log.i("Deleting admin user.")
                    }
                    val map = LinkedHashMap<String, Any>(1)
                    map["ok"] = ok
                    map["data"] = UsersDB.getAll()
                    return map
                }
            }
            return service
        }
        fun getUpload(): Service {
            val service = Service()
            service.method = Service.Method.POST
            service.path = "/upload"
            service.action = object : Closure<LinkedHashMap<String?, Boolean?>?>(this, this) {
                fun doCall(file: File, request: Request): LinkedHashMap<String, Any> {
                    val origName = request.queryParams("orig")
                    val names = origName.split("-")
                    val dir = File("resources/public/data/", names[0])
                    if (!dir.exists()) {
                        dir.mkdirs()
                    }
                    val downloadedFile = File(dir, names[1].replace(" ", "_"))
                    Files.move(file.toPath(), downloadedFile.toPath())
                    val map = LinkedHashMap<String, Any>(1)
                    mapOf("ok" to true)
                    return map
                }
            }
            return service
        }
        fun getSupportingFiles(): Service {
            val service = Service()
            service.method = Service.Method.GET
            service.allow = AuthService.Admin()
            service.path = "/files"
            service.action = object : Closure<LinkedHashMap<String?, Boolean?>?>(this, this) {
                fun doCall(request: Request): LinkedHashMap<String, Any> {
                    var ok = false
                    val list = ArrayList<Map<String, Any>>()
                    val dirName = request.queryParams("name")
                    val userDir = File("resources/public/data/", dirName)
                    if (userDir.exists()) {
                        userDir.walkTopDown().forEach {
                            if (!it.isDirectory)
                                list.add(LinkModel(it.name.replace("_", " "), "/data/$dirName/${it.name.replace(" ", "_")}", "blue").toMap())
                        }
                        ok = true
                    }
                    val map = LinkedHashMap<String, Any>(1)
                    map["ok"] = ok
                    map["data"] = list
                    return map
                }
            }
            return service
        }
        fun getUserLevel(): Service {
            val service = Service()
            service.method = Service.Method.GET
            service.allow = AuthService.Admin()
            service.path = "/level"
            service.action = object : Closure<LinkedHashMap<String?, Boolean?>?>(this, this) {
                fun doCall(request: Request): LinkedHashMap<String, Any> {
                    val map = LinkedHashMap<String, Any>(1)
                    val level = AuthService.getUserLevel(request)
                    map["level"] = level.name
                    return map
                }
            }
            return service
        }
    }
}