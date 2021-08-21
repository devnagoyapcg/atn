package dfa.gov.nagoyapcg.atn.db

import com.intellisrc.core.Log
import com.intellisrc.db.DB
import com.intellisrc.db.Data
import com.intellisrc.db.Database
import dfa.gov.nagoyapcg.atn.db.models.UserModel
import java.util.*
import kotlin.collections.ArrayList
import kotlin.collections.HashMap

class UsersDB() {
    companion object {
        private const val table = "auth"

        fun getAll(): List<UserModel> {
            Log.i("Get the users.")
            val db: DB = Database.getDefault().connect()
            var rows: Data? = null
            if (db.table(table).exists())
                rows = db.table(table).get()
            else
                Log.w("Table $table doesn't exist!")
            db.close()
            return fromData(rows!!)
        }
        fun create(user: Map<String, Any>): Boolean {
            Log.i("Creating new user")
            var ok = false
            var db: DB = Database.getDefault().connect()
            if (db.table(table).exists())
                ok = db.table(table).insert(user)
            else
                Log.w("Table $table doesn't exist!")
            db.close()
            return ok
        }
        fun update(data: UserModel): Boolean {
            Log.i("Updating user information")
            var ok = false
            val db: DB = Database.getDefault().connect()
            if (db.table(table).exists())
                ok = db.table(table).key("id").update(data.toMap(), data.id)
            else
                Log.w("Table $table doesn't exist!")
            db.close()
            return ok
        }
        fun updatePass(id: Int, pass: String): Boolean {
            Log.i("Updating user password")
            var ok = false
            val db: DB = Database.getDefault().connect()
            if (db.table(table).exists())
                ok = db.table(table).key("id").update(mapOf("pass" to pass), id)
            else
                Log.w("Table $table doesn't exist!")
            db.close()
            return ok
        }
        fun deleteUser(id: Int): Boolean {
            Log.i("Deleting user")
            var ok = false
            val db: DB = Database.getDefault().connect()
            if (db.table(table).exists())
                ok = db.table(table).key("id").delete(id)
            else
                Log.w("Table $table doesn't exist!")
            db.close()
            return ok
        }
        private fun fromData(rows: Data): List<UserModel> {
            val list: MutableList<UserModel> = ArrayList()
            val data = rows.toListMap()
            for (datum in data) {
                try {
                    list.add(fromMap(datum))
                } catch (ex: Exception) {
                    Log.w(ex.message)
                }
            }
            return Collections.unmodifiableList(list).sortedBy { it.lastName }
        }
        private fun fromMap(map: Map<Any?, Any?>?): UserModel {
            val cleanData = cleanInputMap(map)
            return UserModel(
                cleanData["id"].toString().toInt(),
                cleanData["user"].toString(),
                cleanData["lastName"].toString(),
                cleanData["firstName"].toString()
            )
        }
        private fun cleanInputMap(input: Map<Any?, Any?>?): Map<Any?, Any?> {
            val cleanMap = HashMap<Any?, Any?>()
            for (inKey in input?.keys!!) {
                when (inKey) {
                    "id" -> cleanMap[inKey] = input[inKey]
                    "user",
                    "pass",
                    "lastName",
                    "firstName" -> cleanMap[inKey] = input[inKey]
                    else -> {
                        Log.w("un-identified key $inKey")
                    }
                }
            }
            return cleanMap
        }
        fun getLastID(): Int {
            val db: DB = Database.getDefault().connect()
            val lastID: Int = if (db.table(table).exists())
                db.table(table).lastID
            else
                0
            db.close()
            return lastID
        }
    }
}