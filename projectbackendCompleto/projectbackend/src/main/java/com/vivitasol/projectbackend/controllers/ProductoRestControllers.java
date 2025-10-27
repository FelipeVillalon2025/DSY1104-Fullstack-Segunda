package com.vivitasol.projectbackend.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.vivitasol.projectbackend.entities.Producto;
import com.vivitasol.projectbackend.exceptions.StockInsuficienteException;
import com.vivitasol.projectbackend.services.ProductoServices;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RestController
@RequestMapping("/api/productos")
@Tag(name = "Productos", description = "API para la gestión de productos")
public class ProductoRestControllers {

    @Autowired
    private ProductoServices productoServices;

    @Operation(summary = "Crear un nuevo producto", description = "Crea un nuevo producto en el sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Producto creado exitosamente",
                content = { @Content(mediaType = "application/json", 
                schema = @Schema(implementation = Producto.class)) }),
        @ApiResponse(responseCode = "400", description = "Datos del producto inválidos")
    })
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

 
    @Operation(summary = "Listar productos", description = "Obtiene la lista de productos con filtros opcionales")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de productos obtenida exitosamente",
                content = { @Content(mediaType = "application/json", 
                schema = @Schema(implementation = Producto.class)) })
    })
    @GetMapping
    public ResponseEntity<List<Producto>> listarProductos(
            @Parameter(description = "Texto para buscar en nombre o descripción") 
            @RequestParam(required = false) String search,
            @Parameter(description = "ID de la categoría para filtrar") 
            @RequestParam(required = false) Long categoriaId) {

        List<Producto> productos = productoServices.listarTodas();

        // Filtrar por búsqueda si se provee
        if (search != null && !search.trim().isEmpty()) {
            String s = search.trim().toLowerCase();
            productos = productos.stream()
                    .filter(p -> (p.getNombre() != null && p.getNombre().toLowerCase().contains(s))
                            || (p.getDescripcion() != null && p.getDescripcion().toLowerCase().contains(s)))
                    .collect(Collectors.toList());
        }

        // Filtrar por categoría si se provee
        if (categoriaId != null) {
            productos = productos.stream()
                    .filter(p -> p.getCategoria() != null && categoriaId.equals(p.getCategoria().getId()))
                    .collect(Collectors.toList());
        }

        return ResponseEntity.ok(productos);
    }

    @Operation(summary = "Listar productos con stock bajo", 
             description = "Obtiene la lista de productos cuyo stock es menor o igual al umbral especificado")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de productos con stock bajo obtenida exitosamente",
                content = { @Content(mediaType = "application/json", 
                schema = @Schema(implementation = Producto.class)) })
    })
    @GetMapping("/low-stock")
    public ResponseEntity<List<Producto>> productosLowStock(
            @Parameter(description = "Umbral de stock bajo (por defecto: 3)") 
            @RequestParam(required = false, defaultValue = "3") Integer threshold) {
        List<Producto> productos = productoServices.listarTodas();
        List<Producto> low = productos.stream()
                .filter(p -> p.getStock() != null && p.getStock() <= threshold)
                .collect(Collectors.toList());
        return ResponseEntity.ok(low);
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
