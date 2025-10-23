package com.vivitasol.projectbackend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.vivitasol.projectbackend.entities.Usuario;
import com.vivitasol.projectbackend.repositories.UsuarioRepositories;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class UsuarioServicesImpl implements UsuarioServices{

    @Autowired
    private UsuarioRepositories usuarioRepositories;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public Usuario crear(Usuario usuario) {
        // encriptar contraseña antes de guardar
    usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));
        return usuarioRepositories.save(usuario);
    }

    @Override
    public Usuario obtenerId(Long id) {
        return usuarioRepositories.findById(id).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @Override
    public List<Usuario> listarTodas() {
        return (List<Usuario>) usuarioRepositories.findAll();
    }

    @Override
    public Usuario actualizar(Long id, Usuario usuarioActualizado) {
        Usuario existente = obtenerId(id);
        existente.setNombre(usuarioActualizado.getNombre());
        existente.setEmail(usuarioActualizado.getEmail());
        if (usuarioActualizado.getContrasena() != null && !usuarioActualizado.getContrasena().isEmpty()){
            existente.setContrasena(passwordEncoder.encode(usuarioActualizado.getContrasena()));
        }
        existente.setRol(usuarioActualizado.getRol());
        existente.setActivo(usuarioActualizado.getActivo());
        return usuarioRepositories.save(existente);
    }

    @Override
    public void eliminar(Long id) {
        if(!usuarioRepositories.existsById(id)){
            throw new RuntimeException("Usuario no encontrado");
        }
        usuarioRepositories.deleteById(id);
    }

    @Override
    public Usuario login(String email, String contraseña) {
        Usuario usuario = usuarioRepositories.findByEmail(email).orElseThrow(() -> new RuntimeException("Credenciales inválidas"));
        if(passwordEncoder.matches(contraseña, usuario.getContrasena())){
            return usuario;
        }
        throw new RuntimeException("Credenciales inválidas");
    }
}
