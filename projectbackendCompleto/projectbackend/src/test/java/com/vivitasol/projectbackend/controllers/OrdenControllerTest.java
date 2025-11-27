package com.vivitasol.projectbackend.controllers;

import com.vivitasol.projectbackend.entities.Orden;
import com.vivitasol.projectbackend.entities.OrdenItem;
import com.vivitasol.projectbackend.entities.Usuario;
import com.vivitasol.projectbackend.entities.Producto;
import com.vivitasol.projectbackend.services.OrdenService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("OrdenController Tests")
public class OrdenControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OrdenService ordenService;

    private Orden orden;
    private Usuario usuario;
    private Producto producto;

    @BeforeEach
    public void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Usuario Test");
        usuario.setEmail("usuario@test.com");
        usuario.setRol("CLIENTE");
        usuario.setActivo(true);

        producto = new Producto();
        producto.setId(1L);
        producto.setNombre("Smartphone Test");
        producto.setPrecio(350000L);
        producto.setStock(10);
        producto.setActivo(true);

        OrdenItem item = new OrdenItem();
        item.setId(1L);
        item.setProducto(producto);
        item.setCantidad(2);
        item.setPrecioUnitario(350000.0);

        orden = new Orden();
        orden.setId(1L);
        orden.setUsuario(usuario);
        orden.setTotal(700000.0);
        orden.setFecha(LocalDateTime.now());
        orden.setItems(new ArrayList<>());
        orden.getItems().add(item);
    }

    @Test
    @DisplayName("Debería listar todas las órdenes")
    public void testListarOrdenes() throws Exception {
        List<Orden> ordenes = new ArrayList<>();
        ordenes.add(orden);

        when(ordenService.listarOrdenes()).thenReturn(ordenes);

        mockMvc.perform(get("/api/ordenes")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].total").value(700000.0))
                .andExpect(jsonPath("$[0].usuario.email").value("usuario@test.com"));
    }

    @Test
    @DisplayName("Debería obtener orden por ID")
    public void testObtenerOrdenPorId() throws Exception {
        when(ordenService.obtenerOrden(1L)).thenReturn(orden);

        mockMvc.perform(get("/api/ordenes/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.total").value(700000.0))
                .andExpect(jsonPath("$.usuario.email").value("usuario@test.com"))
                .andExpect(jsonPath("$.items").isArray());
    }

    @Test
    @DisplayName("Debería crear nueva orden")
    public void testCrearOrden() throws Exception {
        when(ordenService.crearOrden(any(Orden.class))).thenReturn(orden);

        String ordenJson = "{\"usuario\": {\"id\": 1}, \"total\": 700000.0, \"items\": [{\"producto\": {\"id\": 1}, \"cantidad\": 2, \"precioUnitario\": 350000.0}]}";

        mockMvc.perform(post("/api/ordenes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(ordenJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.total").value(700000.0))
                .andExpect(jsonPath("$.usuario.id").value(1L));
    }

    @Test
    @DisplayName("Debería procesar orden incluso con datos inválidos (sin validación)")
    public void testCrearOrdenConDatosInvalidos() throws Exception {
        String ordenJson = "{\"usuario\": null, \"total\": -100, \"items\": []}";

        mockMvc.perform(post("/api/ordenes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(ordenJson))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Debería eliminar orden por ID")
    public void testEliminarOrden() throws Exception {
        doNothing().when(ordenService).eliminarOrden(1L);

        mockMvc.perform(delete("/api/ordenes/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("Debería retornar orden no existente con status 200")
    public void testObtenerOrdenNoExistente() throws Exception {
        when(ordenService.obtenerOrden(999L)).thenReturn(null);

        mockMvc.perform(get("/api/ordenes/999")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Debería crear orden con total cero")
    public void testCrearOrdenConTotalCero() throws Exception {
        Orden ordenCero = new Orden();
        ordenCero.setId(2L);
        ordenCero.setUsuario(usuario);
        ordenCero.setTotal(0.0);
        ordenCero.setFecha(LocalDateTime.now());
        ordenCero.setItems(new ArrayList<>());

        when(ordenService.crearOrden(any(Orden.class))).thenReturn(ordenCero);

        String ordenJson = "{\"usuario\": {\"id\": 1}, \"total\": 0.0, \"items\": []}";

        mockMvc.perform(post("/api/ordenes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(ordenJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(0.0));
    }

    @Test
    @DisplayName("Debería crear orden con múltiples items")
    public void testCrearOrdenConMultiplesItems() throws Exception {
        Orden ordenMultiple = new Orden();
        ordenMultiple.setId(3L);
        ordenMultiple.setUsuario(usuario);
        ordenMultiple.setTotal(1050000.0);
        ordenMultiple.setFecha(LocalDateTime.now());

        OrdenItem item1 = new OrdenItem();
        item1.setProducto(producto);
        item1.setCantidad(2);
        item1.setPrecioUnitario(350000.0);

        Producto producto2 = new Producto();
        producto2.setId(2L);
        producto2.setNombre("Auriculares");
        producto2.setPrecio(75000L);

        OrdenItem item2 = new OrdenItem();
        item2.setProducto(producto2);
        item2.setCantidad(5);
        item2.setPrecioUnitario(75000.0);

        ordenMultiple.setItems(new ArrayList<>());
        ordenMultiple.getItems().add(item1);
        ordenMultiple.getItems().add(item2);

        when(ordenService.crearOrden(any(Orden.class))).thenReturn(ordenMultiple);

        String ordenJson = "{\"usuario\": {\"id\": 1}, \"total\": 1050000.0, \"items\": [{\"producto\": {\"id\": 1}, \"cantidad\": 2}, {\"producto\": {\"id\": 2}, \"cantidad\": 5}]}";

        mockMvc.perform(post("/api/ordenes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(ordenJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(1050000.0))
                .andExpect(jsonPath("$.items.length()").value(2));
    }

    @Test
    @DisplayName("Debería procesar orden sin usuario (sin validación)")
    public void testCrearOrdenSinUsuario() throws Exception {
        String ordenJson = "{\"usuario\": null, \"total\": 100000.0, \"items\": []}";

        mockMvc.perform(post("/api/ordenes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(ordenJson))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Debería procesar orden con total negativo (sin validación)")
    public void testCrearOrdenConTotalNegativo() throws Exception {
        String ordenJson = "{\"usuario\": {\"id\": 1}, \"total\": -50000.0, \"items\": []}";

        mockMvc.perform(post("/api/ordenes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(ordenJson))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Debería retornar lista vacía cuando no hay órdenes")
    public void testListarOrdenesVacio() throws Exception {
        List<Orden> ordenes = new ArrayList<>();

        when(ordenService.listarOrdenes()).thenReturn(ordenes);

        mockMvc.perform(get("/api/ordenes")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    @DisplayName("Debería obtener orden con información completa del usuario")
    public void testObtenerOrdenConDatosCompletos() throws Exception {
        when(ordenService.obtenerOrden(1L)).thenReturn(orden);

        mockMvc.perform(get("/api/ordenes/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.usuario.id").value(1L))
                .andExpect(jsonPath("$.usuario.nombre").value("Usuario Test"))
                .andExpect(jsonPath("$.usuario.email").value("usuario@test.com"))
                .andExpect(jsonPath("$.usuario.rol").value("CLIENTE"));
    }
}
