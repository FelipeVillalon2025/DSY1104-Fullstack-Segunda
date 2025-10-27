package com.vivitasol.projectbackend.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String nombre;
    private String email;
    private String contrasena;
    private String rol;
}
