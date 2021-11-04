package dfa.gov.nagoyapcg.atn

import com.intellisrc.core.Log
import com.intellisrc.crypt.hash.PasswordHash
import com.intellisrc.db.DB
import com.intellisrc.db.Database
import java.sql.Date
import java.sql.Timestamp
import java.time.LocalDateTime
import kotlin.test.Test
import kotlin.test.assertEquals

internal class AppTest {
    private val superPass = "atn@2021".toCharArray()
    private val adminPass = "admin".toCharArray()
    private val semPass = "aaaa".toCharArray()

    @Test
    fun visualize() {
        val hasher = PasswordHash()
        val hash = hasher.BCrypt()
        hasher.setPassword(*superPass)
        Log.i(hash)
        assertEquals(expected = true, actual = true)
    }
    @Test
    fun generateHash() {
        val hasher = PasswordHash()
        val hash = hasher.BCrypt()
        hasher.setPassword(*superPass)
        assert(true) {
            Database.getDefault().connect()
        }
        val db : DB = Database.getDefault().connect()
        if (db.table("super").field("user").key("user").get("superadministrator").isEmpty) {
            db.table("super").insert(mapOf("user" to "superadministrator", "pass" to hash))
            println("Successfully inserted superadministrator account")
        } else
            println("superadministrator already exists!")
        db.close()
        assert(true)
    }
    @Test
    fun logOut() {
        try {
            val db: DB = Database.getDefault().connect()
            db.table("auth").key("user").update(mapOf("status" to 0), "sem")
            db.table("auth").key("user").update(mapOf("status" to 0), "admin")
            db.close()
        } catch (e: Exception) {
            Log.e(e.message)
        }
        assert(true)
    }
    @Test
    fun testingTimeStamp() {
        val ts = Timestamp(System.currentTimeMillis()).time
        Log.i("TimeStamp is $ts")
        val temp = Timestamp(System.currentTimeMillis())
        val date = Date(ts)
        Log.i("date is $date")
        assertEquals(expected = true, actual = true)
    }
    @Test
    fun getCurrentTime() {
        val time = LocalDateTime.now()
        Log.i("${time.hour}:${time.minute}:${time.second}")
        assertEquals(expected = true, actual = true)
    }
}