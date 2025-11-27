package com.vivitasol.projectbackend.services;

import com.vivitasol.projectbackend.entities.Categoria;
import java.util.List;

public interface CategoriaServices {

    Categoria crear(Categoria categoria);
    Categoria obtenerId(Long id);
    List<Categoria> listarTodas();    
    void eliminar(Long id);
    Categoria actualizar(Long id, Categoria categoriaActualizada);

}
