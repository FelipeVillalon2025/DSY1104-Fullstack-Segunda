package com.vivitasol.projectbackend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class OrdenItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "orden_id")
    private Orden orden;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "producto_id")
    private Producto producto;

    private Integer cantidad;
    private Double precioUnitario;

    @PrePersist
    public void prePersist() {
        if ((this.precioUnitario == null || this.precioUnitario == 0) && this.producto != null) {
            // Aseguramos usar el precio actual del producto (double)
            if (this.producto.getPrecio() != null) {
                this.precioUnitario = this.producto.getPrecio().doubleValue();
            }
        }
    }

    // Getter explícito para cantidad
    public Integer getCantidad() {
        return this.cantidad;
    }

    // Getter explícito para precioUnitario
    public Double getPrecioUnitario() {
        return this.precioUnitario;
    }

    // Método para obtener el subtotal del item
    public Double getSubtotal() {
        return (this.cantidad != null ? this.cantidad : 0) * (this.precioUnitario != null ? this.precioUnitario : 0);
    }
}