package com.vivitasol.projectbackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;

import java.util.List;

@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI myOpenAPI() {
        Server devServer = new Server();
        devServer.setUrl("http://localhost:8080");
        devServer.setDescription("Servidor de desarrollo");

        Contact contact = new Contact();
        contact.setEmail("contact@tienda.com");
        contact.setName("Tienda API Support");

        License mitLicense = new License().name("MIT License").url("https://choosealicense.com/licenses/mit/");

        Info info = new Info()
                .title("API de Gestión de Tienda")
                .version("1.0")
                .contact(contact)
                .description("Esta API expone endpoints para gestionar productos, categorías y usuarios.")
                .license(mitLicense);

        return new OpenAPI().info(info).servers(List.of(devServer));
    }
}