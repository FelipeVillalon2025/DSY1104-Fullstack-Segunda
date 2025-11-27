package com.vivitasol.projectbackend.services;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;
import static org.junit.jupiter.api.Assertions.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.vivitasol.projectbackend.entities.Producto;
import com.vivitasol.projectbackend.repositories.ProductoRepositories;
import com.vivitasol.projectbackend.exceptions.StockInsuficienteException;

@ExtendWith(MockitoExtension.class)
public class ProductoServicesImplTest {

    @Mock
    private ProductoRepositories productoRepositories;

    @Mock
    private CategoriaServices categoriaServices;

    @InjectMocks
    private ProductoServicesImpl productoServices;

    private Producto producto;

    @BeforeEach
    void setUp() {
        producto = new Producto();
        producto.setId(1L);
        producto.setNombre("Test Producto");
        producto.setPrecio(1000L);
        producto.setStock(10);
        producto.setActivo(true);
    }

    @Test
    void deberiaCrearProducto() {
        when(productoRepositories.save(any(Producto.class))).thenReturn(producto);

        Producto resultado = productoServices.crear(producto);

        assertNotNull(resultado);
        assertEquals(producto.getNombre(), resultado.getNombre());
        verify(productoRepositories, times(1)).save(any(Producto.class));
    }

    @Test
    void deberiaListarTodosLosProductos() {
        List<Producto> productos = Arrays.asList(producto);
        when(productoRepositories.findAll()).thenReturn(productos);

        List<Producto> resultado = productoServices.listarTodas();

        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals(producto.getNombre(), resultado.get(0).getNombre());
    }

    @Test
    void deberiaReducirStockCuandoHaySuficiente() {
        when(productoRepositories.findById(1L)).thenReturn(Optional.of(producto));
        when(productoRepositories.save(any(Producto.class))).thenReturn(producto);

        Producto resultado = productoServices.reducirStock(1L, 5);

        assertEquals(5, resultado.getStock());
        verify(productoRepositories, times(1)).save(any(Producto.class));
    }

    @Test
    void deberiaLanzarExcepcionCuandoNoHayStockSuficiente() {
        when(productoRepositories.findById(1L)).thenReturn(Optional.of(producto));

        assertThrows(StockInsuficienteException.class, () -> {
            productoServices.reducirStock(1L, 15);
        });
    }

    @Test
    void deberiaDesactivarProducto() {
        when(productoRepositories.findById(1L)).thenReturn(Optional.of(producto));
        when(productoRepositories.save(any(Producto.class))).thenReturn(producto);

        Producto resultado = productoServices.desactivar(1L);

        assertFalse(resultado.getActivo());
        verify(productoRepositories, times(1)).save(any(Producto.class));
    }
}