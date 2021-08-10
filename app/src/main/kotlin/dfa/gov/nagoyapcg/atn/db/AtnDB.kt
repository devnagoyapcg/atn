package dfa.gov.nagoyapcg.atn.db

import com.intellisrc.core.Config
import com.intellisrc.core.Log
import com.intellisrc.core.SysInfo
import com.intellisrc.db.DB
import com.intellisrc.db.Data
import com.intellisrc.db.Database
import com.intellisrc.db.Query
import dfa.gov.nagoyapcg.atn.db.models.CaseModel
import java.io.*
import java.nio.file.Files
import java.util.*
import kotlin.collections.ArrayList
import kotlin.collections.HashMap

class AtnDB {
    companion object {
        private val table = "cases"
        private fun replaceTableName(file: File): File {
            val post = Config.get("post")
            val reader = BufferedReader(FileReader(file))
            var oldTexts = ""
            var line = reader.readLine()
            while (line != null) {
                oldTexts = oldTexts + reader.readLine() + System.lineSeparator()
                Log.i(oldTexts)
                line = reader.readLine()
            }
            val new = oldTexts.replace("main", post)
            val nagoyaFile = File(SysInfo.getFile("resources/"), "$post.sql")
            val writer = FileWriter(nagoyaFile)
            writer.write(new)
            reader.close()
            writer.close()
            return file
        }
        fun getAll(): List<CaseModel> {
            val list = ArrayList<CaseModel>()
            val db: DB = Database.getDefault().connect()
            var rows: Data? = null
            if (db.table(table).exists()) {
                rows = db.table(table).get()
            } else
                Log.w("Table $table doesn't exist!")
            db.close()
            return fromData(rows!!)
        }
        fun saveNewCase(data: CaseModel): Boolean {
            Log.i("Saving new record")
            var ok = false
            val db: DB = Database.getDefault().connect()
            if (db.table(table).exists()) {
                ok = db.table(table).insert(data.toMap())
            } else
                Log.w("Table $table doesn't exist!")
            db.close()
            return ok
        }
        fun saveEditing(data: CaseModel): Boolean {
            Log.i("Saving the edited record")
            var ok = false
            val db: DB = Database.getDefault().connect()
            if (db.table(table).exists()) {
                ok = db.table(table).key("id").update(data.toMap(), data.id)
            } else
                Log.w("Table $table doesn't exist!")
            db.close()
            return ok
        }
        fun deleteCase(id: Int): Boolean {
            Log.i("Deleting the record")
            var ok = false
            val db: DB = Database.getDefault().connect()
            if (db.table(table).exists()) {
                ok = db.table(table).key("id").delete(id)
            } else
                Log.w("Table $table doesn't exist!")
            db.close()
            return ok
        }
        private fun fromData(rows: Data): List<CaseModel> {
            val list: MutableList<CaseModel> = ArrayList()
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
        private fun fromMap(map: Map<Any?, Any?>?): CaseModel {
            val cleanData = cleanInputMap(map)
            return CaseModel(
                cleanData["id"].toString().toInt(),
                cleanData["lastName"].toString(),
                cleanData["firstName"].toString(),
                cleanData["middleName"].toString(),
                cleanData["birthday"].toString(),
                cleanData["birthPlace"].toString(),
                cleanData["gender"].toString(),
                cleanData["dateRecorded"].toString(),
                cleanData["case"].toString(),
                cleanData["action"].toString(),
                cleanData["status"].toString(),
                cleanData["others"].toString()
            )
        }
        private fun cleanInputMap(input: Map<Any?, Any?>?): Map<Any?, Any?> {
            val cleanMap = HashMap<Any?, Any?>()
            var ok = false
            for (inKey in input?.keys!!) {
                when (inKey) {
                    "id" -> cleanMap[inKey] = input[inKey]
                    "lastName",
                    "firstName",
                    "middleName",
                    "birthday",
                    "birthPlace",
                    "gender",
                    "dateRecorded",
                    "case",
                    "action",
                    "status",
                    "others" -> cleanMap[inKey] = input[inKey]
                    else -> {
                        Log.w("Un-identified key $inKey")
                        ok = false
                    }
                }
            }
            return cleanMap
        }
        fun getLastID(): Int {
            val db: DB = Database.getDefault().connect()
            return if (db.table(table).exists())
                db.table(table).lastID
            else
                0
        }
        fun initDB() {
            val dbFile = SysInfo.getFile(Config.get("db.name", "main") + ".db")
            if (!dbFile.exists()) {
                val db: DB = Database.getDefault().connect()
                db.exec(Query(""))
                val file: File = SysInfo.getFile("resources/create.sql")
                if (file.exists()) {
                    try {
                        val query = Files.readString(file.toPath())
                        if (query.isNotEmpty()) {
                            query.replace("\n", "").split(";").forEach {
                                if (it.trim().isNotEmpty())
                                    db.set(it)
                            }
                        }
                        Log.i("Successfully created tables")
                    } catch (e: IOException) {
                        Log.w("File doesn't exist or unable to open %s", e)
                    }
                } else {
                    Log.w("Cannot find ${file.name} file")
                }
                db.close()
            }
        }
    }
}