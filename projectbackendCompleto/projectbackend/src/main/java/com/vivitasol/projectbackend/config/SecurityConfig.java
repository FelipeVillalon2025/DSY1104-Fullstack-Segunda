package com.vivitasol.projectbackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // 1. BEAN DE HASHING
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 2. FILTRO DE SEGURIDAD
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                // Permitir preflight OPTIONS para todas las rutas /api/**
                .requestMatchers("OPTIONS", "/api/**").permitAll()
                // Permitir registro y login a todos
                .requestMatchers("/api/auth/**").permitAll()
                // Permitir ver productos a todos (GET)
                .requestMatchers("GET", "/api/productos/**").permitAll()
                // Permitir registro de usuario a todos
                .requestMatchers("POST", "/api/usuarios").permitAll()
                // Solo ADMIN puede crear, editar, eliminar productos y ver usuarios y órdenes
                .requestMatchers("POST", "/api/productos/**").hasRole("ADMIN")
                .requestMatchers("PUT", "/api/productos/**").hasRole("ADMIN")
                .requestMatchers("DELETE", "/api/productos/**").hasRole("ADMIN")
                .requestMatchers("/api/usuarios/**").hasRole("ADMIN")
                .requestMatchers("/api/ordenes/**").authenticated()
                // El resto requiere autenticación
                .anyRequest().authenticated()
            );
        return http.build();
    }
}