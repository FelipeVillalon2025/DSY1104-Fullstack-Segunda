package com.vivitasol.projectbackend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.vivitasol.projectbackend.entities.Usuario;
import com.vivitasol.projectbackend.services.UsuarioServices;
import java.util.List;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioRestController {

    @Autowired
    private UsuarioServices usuarioServices;

    @PostMapping
    public ResponseEntity<Usuario> crearUsuario(@RequestBody Usuario usuario) {
        Usuario nuevo = usuarioServices.crear(usuario);
        return ResponseEntity.ok(nuevo);
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> listar() {
        return ResponseEntity.ok(usuarioServices.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtener(@PathVariable Long id){
        return ResponseEntity.ok(usuarioServices.obtenerId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizar(@PathVariable Long id, @RequestBody Usuario usuario){
        return ResponseEntity.ok(usuarioServices.actualizar(id, usuario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id){
        usuarioServices.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestBody LoginRequest req){
        Usuario u = usuarioServices.login(req.getEmail(), req.getContrasena());
        // no retornar contraseña en claro
        u.setContrasena(null);
        return ResponseEntity.ok(u);
    }

    public static class LoginRequest{
        private String email;
        private String contrasena;
        public String getEmail(){return email;}
        public void setEmail(String e){this.email = e;}
        public String getContrasena(){return contrasena;}
        public void setContrasena(String c){this.contrasena = c;}
    }
}
