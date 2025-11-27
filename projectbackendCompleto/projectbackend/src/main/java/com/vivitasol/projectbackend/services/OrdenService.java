package com.vivitasol.projectbackend.services;

import com.vivitasol.projectbackend.entities.Orden;
import java.util.List;

public interface OrdenService {
    List<Orden> listarOrdenes();
    Orden obtenerOrden(Long id);
    Orden crearOrden(Orden orden);
    void eliminarOrden(Long id);
}