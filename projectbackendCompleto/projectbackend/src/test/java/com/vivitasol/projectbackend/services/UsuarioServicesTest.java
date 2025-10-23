package com.vivitasol.projectbackend.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import com.vivitasol.projectbackend.entities.Usuario;
import com.vivitasol.projectbackend.repositories.UsuarioRepositories;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

class UsuarioServicesTest {

    @Mock
    private UsuarioRepositories usuarioRepositories;

    @InjectMocks
    private UsuarioServicesImpl usuarioServices;

    @BeforeEach
    void setUp(){
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void crearUsuario_encapsulaContrasena(){
        Usuario u = new Usuario(null, "Admin", "admin@tienda.com", "plainpass", "superadmin", true, null);
        when(usuarioRepositories.save(any())).thenAnswer(i -> {
            Usuario arg = i.getArgument(0);
            arg.setId(1L);
            return arg;
        });
        Usuario res = usuarioServices.crear(u);
        assertNotNull(res.getId());
        assertNotEquals("plainpass", res.getContrasena());
    }

    @Test
    void login_valido(){
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hashed = encoder.encode("mipass");
        Usuario u = new Usuario(2L, "User", "user@tienda.com", hashed, "cliente", true, null);
        when(usuarioRepositories.findByEmail("user@tienda.com")).thenReturn(Optional.of(u));
        Usuario res = usuarioServices.login("user@tienda.com", "mipass");
        assertEquals(u.getEmail(), res.getEmail());
    }
}
