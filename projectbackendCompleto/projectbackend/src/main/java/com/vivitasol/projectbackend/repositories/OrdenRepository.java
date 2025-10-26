package com.vivitasol.projectbackend.repositories;

import com.vivitasol.projectbackend.entities.Orden;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrdenRepository extends CrudRepository<Orden, Long> {
}