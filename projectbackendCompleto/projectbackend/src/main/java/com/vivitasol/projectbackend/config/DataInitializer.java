package com.vivitasol.projectbackend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.vivitasol.projectbackend.entities.Usuario;
import com.vivitasol.projectbackend.entities.Categoria;
import com.vivitasol.projectbackend.entities.Producto;
import com.vivitasol.projectbackend.repositories.UsuarioRepository;
import com.vivitasol.projectbackend.repositories.CategoriaRepositories;
import com.vivitasol.projectbackend.repositories.ProductoRepositories;

import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CategoriaRepositories categoriaRepo;

    @Autowired
    private ProductoRepositories productoRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Crear o actualizar usuario admin
        Usuario admin = usuarioRepository.findByEmail("admin@tienda.com")
                .orElse(new Usuario());
        admin.setNombre("Administrador");
        admin.setEmail("admin@tienda.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRol("ADMIN");
        admin.setActivo(true);
        usuarioRepository.save(admin);

        if (categoriaRepo.count() == 0) {
            List<Categoria> categorias = new ArrayList<>();
            categorias.add(new Categoria(null, "Bebidas", null));
            categorias.add(new Categoria(null, "Snacks", null));
            categorias.add(new Categoria(null, "Panaderia", null));
            categorias.add(new Categoria(null, "Lacteos", null));
            categorias.add(new Categoria(null, "Congelados", null));
            categoriaRepo.saveAll(categorias);

            // crear algunos productos
            List<Producto> productos = new ArrayList<>();
            productos.add(new Producto(null, "Jugo de Naranja", "Jugo natural 1L", 1200L, 10, "/img/jugo.svg", true, categorias.get(0)));
            productos.add(new Producto(null, "Galletas Chocolate", "Paquete 200g", 800L, 15, "/img/galletas.svg", true, categorias.get(1)));
            productos.add(new Producto(null, "Pan Marraqueta", "Unidad", 300L, 20, "/img/pan.svg", true, categorias.get(2)));
            productos.add(new Producto(null, "Leche Entera", "1L", 900L, 5, "/img/leche.svg", true, categorias.get(3)));
            productos.add(new Producto(null, "Pizza Congelada", "1 unidad 400g", 4500L, 4, "/img/pizza.svg", true, categorias.get(4)));
            productos.add(new Producto(null, "Yogurt Natural", "200g", 600L, 8, "/img/yogurt.svg", true, categorias.get(3)));
            productos.add(new Producto(null, "Papas Fritas", "Bolsa 150g", 1000L, 12, "/img/papas.svg", true, categorias.get(1)));
            productos.add(new Producto(null, "Helado Familiar", "1.5L", 5500L, 3, "/img/helado.svg", true, categorias.get(4)));
            productos.add(new Producto(null, "Queso Chihuahua", "200g", 2500L, 6, "/img/queso.svg", true, categorias.get(3)));
            productos.add(new Producto(null, "Torta Chocolate", "Porción", 2000L, 7, "/img/torta.svg", true, categorias.get(2)));
            productos.add(new Producto(null, "Agua Mineral", "500ml", 500L, 30, "/img/agua.svg", true, categorias.get(0)));
            productos.add(new Producto(null, "Barrita Energetica", "50g", 700L, 9, "/img/barrita.svg", true, categorias.get(1)));
            productos.add(new Producto(null, "Croissant", "Unidad", 400L, 11, "/img/croissant.svg", true, categorias.get(2)));
            productos.add(new Producto(null, "Mantequilla", "250g", 1800L, 2, "/img/mantequilla.svg", true, categorias.get(3)));
            productos.add(new Producto(null, "Nuggets Congelados", "500g", 3200L, 5, "/img/nuggets.svg", true, categorias.get(4)));

            productoRepo.saveAll(productos);
        }
    }
}
