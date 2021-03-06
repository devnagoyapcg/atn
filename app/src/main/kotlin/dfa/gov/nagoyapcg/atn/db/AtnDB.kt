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
import java.text.SimpleDateFormat
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.*
import kotlin.collections.ArrayList
import kotlin.collections.HashMap

class AtnDB {
    companion object {
        private const val table = "cases"
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
                //ok = db.table(table).insert(data.toMap())
                ok = db.table(table).insert(mapOf(
                    "lastName"     to data.lastName,
                    "firstName"    to data.firstName,
                    "middleName"   to data.middleName,
                    "birthday"     to data.birthday,
                    "birthPlace"   to data.birthPlace,
                    "gender"       to data.gender,
                    "dateRecorded" to data.dateRecorded,
                    "case"         to data.case,
                    "action"       to data.action,
                    "status"       to data.status,
                    "priority"     to data.priority,
                    "officer"      to data.officer,
                    "others"       to data.others
                ))
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
                ok = db.table(table).key("uid").delete(id)
            } else
                Log.w("Table $table doesn't exist!")
            db.close()
            return ok
        }
        fun generate(from: String, to: String, officer: String): List<CaseModel> {
            val db: DB = Database.getDefault().connect()
            var rows: Data? = null
            if (db.table(table).exists()) {
                rows = if (officer == "All")
                    db.table(table).where("dateRecorded BETWEEN ? AND ?", from, to).get()
                else
                    db.table(table).where("dateRecorded BETWEEN ? AND ?", from, to).key("officer").get(officer)
            } else
                Log.w("Table $table doesn't exist!")
            db.close()
            return fromData(rows!!)
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
                cleanData["priority"].toString(),
                cleanData["officer"].toString(),
                cleanData["others"].toString()
            )
        }
        private fun cleanInputMap(input: Map<Any?, Any?>?): Map<Any?, Any?> {
            val cleanMap = HashMap<Any?, Any?>()
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
                    "priority",
                    "officer",
                    "others" -> cleanMap[inKey] = input[inKey]
                    else -> {
                        Log.w("Un-identified key $inKey")
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
        fun initDB() {
            val dbFile = SysInfo.getFile(Config.get("db.name", "main") + ".db")
            if (!dbFile.exists()) {
                val db: DB = Database.getDefault().connect()
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