package com.vivitasol.projectbackend.services;

import com.vivitasol.projectbackend.entities.Usuario;
import java.util.List;

public interface UsuarioService {
    Usuario crear(Usuario usuario);
    Usuario obtenerPorId(Long id);
    Usuario obtenerPorEmail(String email);
    List<Usuario> listarTodos();
    Usuario actualizar(Long id, Usuario usuario);
    void eliminar(Long id);
    Usuario desactivar(Long id);
    Usuario autenticar(String email, String contrasena);
}