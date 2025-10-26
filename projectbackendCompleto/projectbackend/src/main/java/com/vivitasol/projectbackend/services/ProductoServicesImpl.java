package com.vivitasol.projectbackend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.vivitasol.projectbackend.entities.Categoria;
import com.vivitasol.projectbackend.entities.Producto;
import com.vivitasol.projectbackend.exceptions.StockInsuficienteException;
import com.vivitasol.projectbackend.repositories.ProductoRepositories;

@Service
public class ProductoServicesImpl implements ProductoServices{

    @Autowired
    private ProductoRepositories productoRepositories;
    
    @Autowired
    private CategoriaServices categoriaServices;

    @Override
    public Producto crear(Producto producto){
        if (producto.getCategoria() != null && producto.getCategoria().getId() != null) {
            Categoria categoria = categoriaServices.obtenerId(producto.getCategoria().getId());
            producto.setCategoria(categoria);
        }
        return productoRepositories.save(producto);
    }


    @Override
    public Producto obtenerId(Long id) {
        return productoRepositories.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    @Override
    public List<Producto> listarTodas() {
        return (List<Producto>) productoRepositories.findAll();
    }

    @Override
    public void eliminar(Long id) {
        if (!productoRepositories.existsById(id)) {
            throw new RuntimeException("Producto no encontrado");
        }
       productoRepositories.deleteById(id);
    }

    @Override
    public Producto actualizar(Long id, Producto productoActualizado) {
        Producto existente = obtenerId(id);
        existente.setDescripcion(productoActualizado.getDescripcion());
        existente.setPrecio(productoActualizado.getPrecio());
        return productoRepositories.save(existente);
    }

    @Override
    public Producto desactivar(Long id){
        Producto producto = obtenerId(id);
        producto.setActivo(false);
        return productoRepositories.save(producto);
    }

    @Override
    public Producto activar(Long id) {
        Producto producto = obtenerId(id);
        producto.setActivo(true);
        return productoRepositories.save(producto);
    }

    @Override
    public Producto actualizarImagen(Long id, String imagenUrl) {
        Producto producto = obtenerId(id);
        producto.setImagenUrl(imagenUrl);
        return productoRepositories.save(producto);
    }

    @Override
    public Producto actualizarStock(Long id, Integer cantidad) {
        if (cantidad < 0) {
            throw new IllegalArgumentException("La cantidad no puede ser negativa");
        }
        Producto producto = obtenerId(id);
        producto.setStock(cantidad);
        return productoRepositories.save(producto);
    }
    
    @Override
    public Producto reducirStock(Long id, Integer cantidad) {
        Producto producto = obtenerId(id);
        if (producto.getStock() < cantidad) {
            throw new StockInsuficienteException("No hay suficiente stock disponible");
        }
        producto.setStock(producto.getStock() - cantidad);
        return productoRepositories.save(producto);
    }
}
