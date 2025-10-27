package com.vivitasol.projectbackend.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.vivitasol.projectbackend.entities.Usuario;
import com.vivitasol.projectbackend.repositories.UsuarioRepository;

class UsuarioServiceImplTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioServiceImpl usuarioService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void crear_DeberiaGuardarUsuarioConPasswordEncriptado() {
        // Arrange
        Usuario usuario = new Usuario();
        usuario.setNombre("Test User");
        usuario.setEmail("test@test.com");
        usuario.setPassword("password123");
        usuario.setRol("CLIENTE");
        usuario.setActivo(true);

        when(usuarioRepository.existsByEmail(usuario.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(usuario.getPassword())).thenReturn("encrypted_password");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        // Act
        Usuario resultado = usuarioService.crear(usuario);

        // Assert
        assertNotNull(resultado);
        assertEquals("encrypted_password", resultado.getPassword());
        verify(passwordEncoder).encode("password123");
        verify(usuarioRepository).save(usuario);
    }

    @Test
    void autenticar_DeberiaRetornarUsuarioSiCredencialesCorrectas() {
        // Arrange
        String email = "test@test.com";
        String password = "password123";
        Usuario usuario = new Usuario();
        usuario.setEmail(email);
        usuario.setPassword("encrypted_password");
        usuario.setActivo(true);

        when(usuarioRepository.findByEmail(email)).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches(password, "encrypted_password")).thenReturn(true);

        // Act
        Usuario resultado = usuarioService.autenticar(email, password);

        // Assert
        assertNotNull(resultado);
        assertEquals(email, resultado.getEmail());
        verify(passwordEncoder).matches(password, "encrypted_password");
    }

    @Test
    void listarTodos_DeberiaRetornarListaDeUsuarios() {
        // Arrange
        List<Usuario> usuarios = Arrays.asList(
            new Usuario(1L, "User1", "user1@test.com", "pass1", "CLIENTE", true, null),
            new Usuario(2L, "User2", "user2@test.com", "pass2", "VENDEDOR", true, null)
        );
        when(usuarioRepository.findAll()).thenReturn(usuarios);

        // Act
        List<Usuario> resultado = usuarioService.listarTodos();

        // Assert
        assertEquals(2, resultado.size());
        verify(usuarioRepository).findAll();
    }
}