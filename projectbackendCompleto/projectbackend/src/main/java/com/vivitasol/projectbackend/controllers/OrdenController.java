package com.vivitasol.projectbackend.controllers;

import com.vivitasol.projectbackend.entities.Orden;
import com.vivitasol.projectbackend.services.OrdenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}, allowCredentials = "true")
@RestController
@RequestMapping("/api/ordenes")
public class OrdenController {

    @Autowired
    private OrdenService ordenService;

    @GetMapping
    public ResponseEntity<List<Orden>> listarOrdenes() {
        return ResponseEntity.ok(ordenService.listarOrdenes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Orden> obtenerOrden(@PathVariable Long id) {
        return ResponseEntity.ok(ordenService.obtenerOrden(id));
    }

    @PostMapping
    public ResponseEntity<Orden> crearOrden(@RequestBody Orden orden) {
        return ResponseEntity.ok(ordenService.crearOrden(orden));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarOrden(@PathVariable Long id) {
        ordenService.eliminarOrden(id);
        return ResponseEntity.noContent().build();
    }
}