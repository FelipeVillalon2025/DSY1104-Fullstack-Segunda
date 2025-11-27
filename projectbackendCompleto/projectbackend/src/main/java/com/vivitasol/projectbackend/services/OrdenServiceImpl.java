package com.vivitasol.projectbackend.services;

import com.vivitasol.projectbackend.entities.Orden;
import com.vivitasol.projectbackend.entities.OrdenItem;
import com.vivitasol.projectbackend.repositories.OrdenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrdenServiceImpl implements OrdenService {

    @Autowired
    private OrdenRepository ordenRepository;

    @Override
    public List<Orden> listarOrdenes() {
        return (List<Orden>) ordenRepository.findAll();
    }

    @Override
    public Orden obtenerOrden(Long id) {
        return ordenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));
    }

    @Autowired
    private ProductoServices productoServices;

    @Override
    @Transactional
    public Orden crearOrden(Orden orden) {
        // Validar y reducir el stock de cada producto
        for (OrdenItem item : orden.getItems()) {
            productoServices.reducirStock(item.getProducto().getId(), item.getCantidad());
        }
        
        // Establecer la fecha actual si no se proporcionó
        if (orden.getFecha() == null) {
            orden.setFecha(LocalDateTime.now());
        }
        
        // Calcular el total si no se proporcionó
        if (orden.getTotal() == null) {
            double total = orden.getItems().stream()
                .mapToDouble(item -> item.getCantidad() * item.getPrecioUnitario())
                .sum();
            orden.setTotal(total);
        }
        
        return ordenRepository.save(orden);
    }

    @Override
    public void eliminarOrden(Long id) {
        if (!ordenRepository.existsById(id)) {
            throw new RuntimeException("Orden no encontrada");
        }
        ordenRepository.deleteById(id);
    }
}