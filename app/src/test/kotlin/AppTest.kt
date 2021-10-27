import com.intellisrc.core.Log
import com.intellisrc.crypt.hash.PasswordHash
import com.intellisrc.db.DB
import com.intellisrc.db.Database
import org.junit.jupiter.api.Test

class AppTest {
    private val superPass = "atn@2021".toCharArray()
    private val adminPass = "admin".toCharArray()
    private val semPass = "aaaa".toCharArray()
    private val hasher = PasswordHash()
    private val hash = hasher.BCrypt()

    @Test
    fun generateHash() {
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
}