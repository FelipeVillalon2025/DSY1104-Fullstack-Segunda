package com.vivitasol.projectbackend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vivitasol.projectbackend.entities.Producto;
import com.vivitasol.projectbackend.exceptions.StockInsuficienteException;
import com.vivitasol.projectbackend.services.ProductoServices;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RestController
@RequestMapping("/api/productos")
public class ProductoRestControllers {

    @Autowired
    private ProductoServices productoServices;

    @PostMapping
    public ResponseEntity<Producto> crearProducto(@RequestBody Producto producto) {
        // Validar stock
        if (producto.getStock() == null) {
            producto.setStock(0);
        }
        if (producto.getStock() < 0) {
            throw new IllegalArgumentException("El stock no puede ser negativo");
        }
        Producto nuevoProducto = productoServices.crear(producto);
        return ResponseEntity.ok(nuevoProducto);
    }
    
    @PostMapping("/{id}/imagen")
    public ResponseEntity<Producto> actualizarImagen(@PathVariable Long id, @RequestBody ImagenRequest request) {
        try {
            Producto producto = productoServices.actualizarImagen(id, request.getImagenUrl());
            return ResponseEntity.ok(producto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/stock")
    public ResponseEntity<?> actualizarStock(@PathVariable Long id, @RequestBody StockRequest request) {
        try {
            if (request.getCantidad() == null) {
                return ResponseEntity.badRequest().build();
            }
            Producto producto = productoServices.actualizarStock(id, request.getCantidad());
            return ResponseEntity.ok(producto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/reducir-stock")
    public ResponseEntity<?> reducirStock(@PathVariable Long id, @RequestBody StockRequest request) {
        try {
            if (request.getCantidad() == null) {
                return ResponseEntity.badRequest().build();
            }
            Producto producto = productoServices.reducirStock(id, request.getCantidad());
            return ResponseEntity.ok(producto);
        } catch (StockInsuficienteException e) {
            return ResponseEntity
                .status(400)
                .body(new ErrorResponse(e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerProductoPorId(@PathVariable Long id) {
        Producto producto = productoServices.obtenerId(id);
        return ResponseEntity.ok(producto);
    }

 
    @GetMapping
    public ResponseEntity<List<Producto>> listarProductos() {
        List<Producto> productos = productoServices.listarTodas();
        return ResponseEntity.ok(productos);
    }

  
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        productoServices.eliminar(id);
        return ResponseEntity.noContent().build();
    }

   
    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizarProducto(@PathVariable Long id, @RequestBody Producto productoActualizado) {
        Producto producto = productoServices.actualizar(id, productoActualizado);
        return ResponseEntity.ok(producto);
    }


    
    @PatchMapping("/{id}/desactivar")
    public ResponseEntity<Producto> desactivar(@PathVariable Long id) {
        return ResponseEntity.ok(productoServices.desactivar(id));
    }

    @PatchMapping("/{id}/activar")
    public ResponseEntity<Producto> activar(@PathVariable Long id) {
        return ResponseEntity.ok(productoServices.activar(id));
    }

    public static class StockRequest {
        private Integer cantidad;
        public Integer getCantidad() { return cantidad; }
        public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    }

    public static class ImagenRequest {
        private String imagenUrl;
        public String getImagenUrl() { return imagenUrl; }
        public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }
    }

    public static class ErrorResponse {
        private String mensaje;
        public ErrorResponse(String mensaje) { this.mensaje = mensaje; }
        public String getMensaje() { return mensaje; }
        public void setMensaje(String mensaje) { this.mensaje = mensaje; }
    }
}
