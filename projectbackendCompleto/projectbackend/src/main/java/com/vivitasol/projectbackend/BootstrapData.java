package com.vivitasol.projectbackend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Autowired;
import com.vivitasol.projectbackend.repositories.UsuarioRepository;
import com.vivitasol.projectbackend.entities.Usuario;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.time.LocalDateTime;

@Configuration
public class BootstrapData {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Bean
    CommandLineRunner initAdmin(){
        return args -> {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            String adminEmail = "admin@tienda.com";
            Usuario existing = usuarioRepository.findByEmail(adminEmail).orElse(null);
            if (existing == null){
                Usuario admin = new Usuario();
                admin.setNombre("Administrador");
                admin.setEmail(adminEmail);
                admin.setPassword(encoder.encode("admin123"));
                admin.setRol("ADMIN");
                admin.setActivo(true);
                admin.setCreadoEn(LocalDateTime.now());
                usuarioRepository.save(admin);
                System.out.println("Admin creado: " + adminEmail);
            } else {
                // si existe pero la contraseña parece no estar encriptada (muy simple heurística)
                String pwd = existing.getPassword();
                if (pwd != null && !pwd.startsWith("$2a$") && !pwd.startsWith("$2b$") && !pwd.startsWith("$2y$")){
                    existing.setPassword(encoder.encode(pwd));
                    usuarioRepository.save(existing);
                    System.out.println("Admin existente actualizado y contraseña encriptada: " + adminEmail);
                }
            }
        };
    }

}
