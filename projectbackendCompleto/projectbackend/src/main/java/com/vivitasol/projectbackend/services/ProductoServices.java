package com.vivitasol.projectbackend.services;

import java.util.List;
import com.vivitasol.projectbackend.entities.Producto;

public interface ProductoServices {

    Producto crear(Producto producto);
    Producto obtenerId(Long id);
    List<Producto> listarTodas();    
    void eliminar(Long id);
    Producto actualizar(Long id, Producto productoActualizado);
    Producto desactivar(Long id);
    Producto activar(Long id);
    Producto actualizarImagen(Long id, String imagenUrl);
    Producto actualizarStock(Long id, Integer cantidad);
    Producto reducirStock(Long id, Integer cantidad);
}
