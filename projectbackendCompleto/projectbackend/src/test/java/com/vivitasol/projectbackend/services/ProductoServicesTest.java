package com.vivitasol.projectbackend.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import com.vivitasol.projectbackend.entities.Producto;
import com.vivitasol.projectbackend.entities.Categoria;
import com.vivitasol.projectbackend.repositories.ProductoRepositories;
import com.vivitasol.projectbackend.exceptions.StockInsuficienteException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

class ProductoServicesTest {

    @Mock
    private ProductoRepositories productoRepositories;

    @Mock
    private CategoriaServices categoriaServices;

    @InjectMocks
    private ProductoServicesImpl productoServices;

    @BeforeEach
    void setUp(){
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void crearProducto_DebeGuardar() {
        // Arrange
        Categoria categoria = new Categoria(1L, "Bebidas", null);
        Producto producto = new Producto(null, "Coca Cola", "Refresco 600ml", 1500L, 10, "/img/coca.jpg", true, categoria);
        when(categoriaServices.obtenerId(1L)).thenReturn(categoria);
        when(productoRepositories.save(any())).thenReturn(producto);

        // Act
        Producto resultado = productoServices.crear(producto);

        // Assert
        assertNotNull(resultado);
        assertEquals("Coca Cola", resultado.getNombre());
        assertEquals(1500L, resultado.getPrecio());
        verify(productoRepositories).save(producto);
        verify(categoriaServices).obtenerId(1L);
    }

    @Test
    void obtenerProductoExistente_DebeRetornarProducto() {
        // Arrange
        Producto producto = new Producto(1L, "Coca Cola", "Refresco 600ml", 1500L, 10, "/img/coca.jpg", true, null);
        when(productoRepositories.findById(1L)).thenReturn(Optional.of(producto));

        // Act
        Producto resultado = productoServices.obtenerId(1L);

        // Assert
        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        assertEquals("Coca Cola", resultado.getNombre());
    }

    @Test
    void desactivarProducto_DebeCambiarEstadoActivo() {
        // Arrange
        Producto producto = new Producto(2L, "Pepsi", "Refresco 600ml", 1400L, 5, "/img/pepsi.jpg", true, null);
        when(productoRepositories.findById(2L)).thenReturn(Optional.of(producto));
        when(productoRepositories.save(any())).thenAnswer(i -> i.getArgument(0));

        // Act
        Producto resultado = productoServices.desactivar(2L);

        // Assert
        assertFalse(resultado.getActivo());
        verify(productoRepositories).save(producto);
    }

    @Test
    void listarProductos_DebeRetornarTodos() {
        // Arrange
        Categoria bebidas = new Categoria(1L, "Bebidas", null);
        List<Producto> productos = Arrays.asList(
            new Producto(1L, "Coca Cola", "Refresco 600ml", 1500L, 10, "/img/coca.jpg", true, bebidas),
            new Producto(2L, "Pepsi", "Refresco 600ml", 1400L, 5, "/img/pepsi.jpg", true, bebidas)
        );
        when(productoRepositories.findAll()).thenReturn(productos);

        // Act
        List<Producto> resultado = productoServices.listarTodas();

        // Assert
        assertEquals(2, resultado.size());
        verify(productoRepositories).findAll();
    }

    @Test
    void actualizarStock_DebeModificarStock() {
        // Arrange
        Producto producto = new Producto(1L, "Coca Cola", "Refresco 600ml", 1500L, 10, "/img/coca.jpg", true, null);
        when(productoRepositories.findById(1L)).thenReturn(Optional.of(producto));
        when(productoRepositories.save(any())).thenAnswer(i -> i.getArgument(0));

        // Act
        Producto resultado = productoServices.actualizarStock(1L, 20);

        // Assert
        assertEquals(20, resultado.getStock());
        verify(productoRepositories).save(producto);
    }

    @Test
    void actualizarStock_ConCantidadNegativa_DebeLanzarExcepcion() {
        // Arrange
        Producto producto = new Producto(1L, "Coca Cola", "Refresco 600ml", 1500L, 10, "/img/coca.jpg", true, null);
        when(productoRepositories.findById(1L)).thenReturn(Optional.of(producto));

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            productoServices.actualizarStock(1L, -5);
        });
    }

    @Test
    void reducirStock_ConStockSuficiente_DebeReducirStock() {
        // Arrange
        Producto producto = new Producto(1L, "Coca Cola", "Refresco 600ml", 1500L, 10, "/img/coca.jpg", true, null);
        when(productoRepositories.findById(1L)).thenReturn(Optional.of(producto));
        when(productoRepositories.save(any())).thenAnswer(i -> i.getArgument(0));

        // Act
        Producto resultado = productoServices.reducirStock(1L, 3);

        // Assert
        assertEquals(7, resultado.getStock());
        verify(productoRepositories).save(producto);
    }

    @Test
    void reducirStock_ConStockInsuficiente_DebeLanzarExcepcion() {
        // Arrange
        Producto producto = new Producto(1L, "Coca Cola", "Refresco 600ml", 1500L, 5, "/img/coca.jpg", true, null);
        when(productoRepositories.findById(1L)).thenReturn(Optional.of(producto));

        // Act & Assert
        assertThrows(StockInsuficienteException.class, () -> {
            productoServices.reducirStock(1L, 10);
        });
    }
}
