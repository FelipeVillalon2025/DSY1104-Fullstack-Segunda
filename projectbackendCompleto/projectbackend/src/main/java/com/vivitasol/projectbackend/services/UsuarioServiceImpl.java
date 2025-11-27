package com.vivitasol.projectbackend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

import com.vivitasol.projectbackend.entities.Usuario;
import com.vivitasol.projectbackend.repositories.UsuarioRepository;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;

@Service
public class UsuarioServiceImpl implements UsuarioService, UserDetailsService {
    // Implementación para integración con Spring Security
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    Usuario usuario = usuarioRepository.findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));
    return User.builder()
        .username(usuario.getEmail())
        .password(usuario.getPassword())
        .roles(usuario.getRol())
        .disabled(!usuario.getActivo())
        .build();
    }

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Usuario crear(Usuario usuario) {
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }
        if (usuario.getPassword() != null) {
            usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        }
        return usuarioRepository.save(usuario);
    }

    @Override
    public Usuario obtenerId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));
    }

    @Override
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    @Override
    public Usuario actualizar(Long id, Usuario usuarioActualizado) {
        Usuario existente = obtenerId(id);

        if (!existente.getEmail().equals(usuarioActualizado.getEmail()) &&
                usuarioRepository.existsByEmail(usuarioActualizado.getEmail())) {
            throw new RuntimeException("El email ya está en uso");
        }

        existente.setNombre(usuarioActualizado.getNombre());
        existente.setEmail(usuarioActualizado.getEmail());
        if (usuarioActualizado.getPassword() != null && !usuarioActualizado.getPassword().isEmpty()) {
            existente.setPassword(passwordEncoder.encode(usuarioActualizado.getPassword()));
        }
        existente.setRol(usuarioActualizado.getRol());
        existente.setActivo(usuarioActualizado.getActivo());

        return usuarioRepository.save(existente);
    }

    @Override
    public void eliminar(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new EntityNotFoundException("Usuario no encontrado");
        }
        usuarioRepository.deleteById(id);
    }

    @Override
    public Usuario inhabilitar(Long id) {
        Usuario usuario = obtenerId(id);
        usuario.setActivo(false);
        return usuarioRepository.save(usuario);
    }

    @Override
    public Usuario encontrarPorEmail(String email) {
        return usuarioRepository.findByEmail(email).orElse(null);
    }

    @Override
    public Usuario autenticar(String email, String contrasena) {
        System.out.println("[LOGIN] Intentando autenticar: " + email);
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> {
                System.out.println("[LOGIN] Usuario no encontrado: " + email);
                return new RuntimeException("Credenciales inválidas");
            });
        System.out.println("[LOGIN] Usuario encontrado. Email: " + usuario.getEmail() + ", Rol: " + usuario.getRol() + ", Activo: " + usuario.getActivo());
        boolean pwdMatch = passwordEncoder.matches(contrasena, usuario.getPassword());
        System.out.println("[LOGIN] Contraseña coincide: " + pwdMatch);
        if (!pwdMatch) {
            System.out.println("[LOGIN] Contraseña incorrecta para: " + email);
            throw new RuntimeException("Credenciales inválidas");
        }
        if (!usuario.getActivo()) {
            System.out.println("[LOGIN] Usuario inactivo: " + email);
            throw new RuntimeException("Usuario inactivo");
        }
        System.out.println("[LOGIN] Autenticación exitosa para: " + email);
        return usuario;
    }
}