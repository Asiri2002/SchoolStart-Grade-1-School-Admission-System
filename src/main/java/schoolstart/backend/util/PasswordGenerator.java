//bcrypt the password for education admin
package schoolstart.backend.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordGenerator {

    public static void main(String[] args) {

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        String password = "asiri123";

        String hash = encoder.encode(password);

        System.out.println("BCrypt Password:");
        System.out.println(hash);
    }
}
