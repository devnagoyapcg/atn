import com.intellisrc.crypt.hash.PasswordHash;
import com.intellisrc.etc.Bytes;
import org.junit.Test;

public class AppTest {
    @Test
    public void PasswordHashTest() {
        byte[] pass = Bytes.fromString("admin");
        PasswordHash hasher = new PasswordHash();
        hasher.setPassword(Bytes.toChars(pass));
        String hash = hasher.BCrypt();
        System.out.println(hash);
    }
}
