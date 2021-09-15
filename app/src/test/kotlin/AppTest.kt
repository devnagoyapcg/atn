import com.intellisrc.crypt.hash.PasswordHash
import com.intellisrc.db.DB
import com.intellisrc.db.Database
import org.junit.jupiter.api.Test

class AppTest {
    @Test
    fun generateHash() {
        val pass = "atn@2021".toCharArray()
        val hasher = PasswordHash()
        hasher.setPassword(*pass)
        val hash = hasher.BCrypt()
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
}