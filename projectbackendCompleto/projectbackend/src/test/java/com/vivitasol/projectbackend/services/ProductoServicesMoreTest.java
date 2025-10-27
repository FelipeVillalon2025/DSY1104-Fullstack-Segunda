package com.vivitasol.projectbackend.services;

import static org.mockito.Mockito.*;

import java.util.Optional;

import com.vivitasol.projectbackend.entities.Producto;
import com.vivitasol.projectbackend.repositories.ProductoRepositories;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

class ProductoServicesMoreTest {

    @Mock
    private ProductoRepositories productoRepositories;

    @InjectMocks
    private ProductoServicesImpl productoServices;

    @BeforeEach
    void setUp(){
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void actualizarStock_valido() {
        Producto p = new Producto(3L, "Prod3", "Desc3", 150L, 7, "url3", true, null);
        when(productoRepositories.findById(3L)).thenReturn(Optional.of(p));
        when(productoRepositories.save(any())).thenAnswer(i -> i.getArgument(0));
        Producto res = productoServices.actualizarStock(3L, 12);
        org.junit.jupiter.api.Assertions.assertEquals(12, res.getStock());
    }

    @Test
    void reducirStock_valido() {
        Producto p = new Producto(4L, "Prod4", "Desc4", 300L, 10, "url4", true, null);
        when(productoRepositories.findById(4L)).thenReturn(Optional.of(p));
        when(productoRepositories.save(any())).thenAnswer(i -> i.getArgument(0));
        Producto res = productoServices.reducirStock(4L, 4);
        org.junit.jupiter.api.Assertions.assertEquals(6, res.getStock());
    }

    @Test
    void reducirStock_insuficiente_lanzaExcepcion() {
        Producto p = new Producto(5L, "Prod5", "Desc5", 500L, 2, "url5", true, null);
        when(productoRepositories.findById(5L)).thenReturn(Optional.of(p));
        org.junit.jupiter.api.function.Executable code = () -> productoServices.reducirStock(5L, 3);
        org.junit.jupiter.api.Assertions.assertThrows(com.vivitasol.projectbackend.exceptions.StockInsuficienteException.class, code);
    }

    @Test
    void eliminar_noExiste_lanzaRuntime() {
        when(productoRepositories.existsById(99L)).thenReturn(false);
        org.junit.jupiter.api.function.Executable code = () -> productoServices.eliminar(99L);
        org.junit.jupiter.api.Assertions.assertThrows(RuntimeException.class, code);
    }
}
