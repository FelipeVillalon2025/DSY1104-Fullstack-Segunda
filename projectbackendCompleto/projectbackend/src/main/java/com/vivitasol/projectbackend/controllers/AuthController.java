package com.vivitasol.projectbackend.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.vivitasol.projectbackend.entities.Usuario;
import com.vivitasol.projectbackend.services.UsuarioService;
import com.vivitasol.projectbackend.dto.LoginRequest;
import com.vivitasol.projectbackend.dto.LoginResponse;
import com.vivitasol.projectbackend.security.JwtUtil;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {


    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Usuario usuario = usuarioService.autenticar(
                loginRequest.getEmail(),
                loginRequest.getContrasena()
            );
            // Crear claims personalizados
            HashMap<String, Object> claims = new HashMap<>();
            claims.put("rol", usuario.getRol());
            claims.put("id", usuario.getId());
            claims.put("nombre", usuario.getNombre());
            // Generar token JWT
            String token = jwtUtil.generateToken(usuario.getEmail(), claims);
            return ResponseEntity.ok(new LoginResponse(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.getRol(),
                token
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}