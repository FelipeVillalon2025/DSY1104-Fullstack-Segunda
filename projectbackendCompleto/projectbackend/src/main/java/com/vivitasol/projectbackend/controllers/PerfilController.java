package com.vivitasol.projectbackend.controllers;

import com.vivitasol.projectbackend.entities.Usuario;
import com.vivitasol.projectbackend.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/perfil")
@CrossOrigin(origins = "http://localhost:5173")
public class PerfilController {

    @Autowired
    private UsuarioService usuarioService;

    // Obtener perfil del usuario autenticado
    @GetMapping
    public ResponseEntity<?> getPerfil(Authentication authentication) {
        String email = authentication.getName();
        Usuario usuario = usuarioService.encontrarPorEmail(email);
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(usuario);
    }

    // Editar perfil del usuario autenticado
    @PutMapping
    public ResponseEntity<?> updatePerfil(Authentication authentication, @RequestBody Usuario datos) {
        String email = authentication.getName();
        Usuario usuario = usuarioService.encontrarPorEmail(email);
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }
        usuario.setNombre(datos.getNombre());
        usuario.setEmail(datos.getEmail());
        if (datos.getPassword() != null && !datos.getPassword().isEmpty()) {
            usuario.setPassword(datos.getPassword());
        }
        usuarioService.actualizar(usuario.getId(), usuario);
        return ResponseEntity.ok(usuario);
    }
}
