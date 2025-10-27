package com.vivitasol.projectbackend.services;

import com.vivitasol.projectbackend.entities.Usuario;
import java.util.List;

public interface UsuarioService {
    Usuario crear(Usuario usuario);
    Usuario obtenerId(Long id);
    List<Usuario> listarTodos();
    Usuario actualizar(Long id, Usuario usuarioActualizado);
    void eliminar(Long id);
    Usuario inhabilitar(Long id);
    Usuario encontrarPorEmail(String email);
    Usuario autenticar(String email, String contrasena);
}