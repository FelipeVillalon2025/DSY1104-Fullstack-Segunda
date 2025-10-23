package com.vivitasol.projectbackend.services;

import com.vivitasol.projectbackend.entities.Usuario;
import java.util.List;

public interface UsuarioServices {
    Usuario crear(Usuario usuario);
    Usuario obtenerId(Long id);
    List<Usuario> listarTodas();
    Usuario actualizar(Long id, Usuario usuarioActualizado);
    void eliminar(Long id);
    Usuario login(String email, String contraseña);
}
