package com.vivitasol.projectbackend.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import com.vivitasol.projectbackend.entities.Producto;
import com.vivitasol.projectbackend.repositories.ProductoRepositories;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

class ProductoServicesTest {

    @Mock
    private ProductoRepositories productoRepositories;

    @InjectMocks
    private ProductoServicesImpl productoServices;

    @BeforeEach
    void setUp(){
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void crearProducto_debeGuardar(){
        Producto p = new Producto(null, "Prod", "Desc", 100L, 10, "url", true, null);
        when(productoRepositories.save(any())).thenReturn(p);
        Producto res = productoServices.crear(p);
        assertNotNull(res);
        verify(productoRepositories, times(1)).save(p);
    }

    @Test
    void obtenerId_existente(){
        Producto p = new Producto(1L, "Prod", "Desc", 100L, 10, "url", true, null);
        when(productoRepositories.findById(1L)).thenReturn(Optional.of(p));
        Producto res = productoServices.obtenerId(1L);
        assertEquals(1L, res.getId());
    }

    @Test
    void desactivar_cambiaActivo(){
        Producto p = new Producto(2L, "Prod2", "Desc2", 200L, 5, "url2", true, null);
        when(productoRepositories.findById(2L)).thenReturn(Optional.of(p));
        when(productoRepositories.save(any())).thenAnswer(i -> i.getArgument(0));
        Producto res = productoServices.desactivar(2L);
        assertFalse(res.getActivo());
    }
}
