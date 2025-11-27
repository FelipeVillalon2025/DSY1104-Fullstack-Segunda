package com.vivitasol.projectbackend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Orden {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    private LocalDateTime fecha;
    private Double total;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "orden", fetch = FetchType.EAGER)
    private List<OrdenItem> items;

    @PrePersist
    public void prePersist() {
        if (this.fecha == null) {
            this.fecha = LocalDateTime.now();
        }
        if (this.total == null && this.items != null) {
            this.total = this.items.stream()
                .mapToDouble(i -> (i.getCantidad() != null ? i.getCantidad() : 0) * (i.getPrecioUnitario() != null ? i.getPrecioUnitario() : 0))
                .sum();
        }
    }

    // Getter explícito para fecha (para PDF)
    public LocalDateTime getFecha() {
        return this.fecha;
    }
}