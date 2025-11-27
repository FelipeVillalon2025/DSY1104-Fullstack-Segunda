# Tienda Virtual - Aplicación Fullstack

## Descripción
Aplicación fullstack para gestión de tienda virtual desarrollada con Spring Boot y React. Permite gestionar productos, categorías y usuarios, con autenticación y control de acceso basado en roles.

## Tecnologías Utilizadas

### Backend
- Java 21
- Spring Boot 3.5.6
- Spring Data JPA
- MySQL
- Swagger/OpenAPI para documentación
- BCrypt para encriptación de contraseñas
- JUnit y Mockito para testing

### Frontend
- React 19
- React Router DOM
- Bootstrap 5
- Vite como bundler

## Requisitos Previos
- Java 21
- Node.js 18+
- MySQL 8+ (XAMPP)
- Maven

## Configuración

### Base de Datos
1. Iniciar MySQL en XAMPP (puerto 3308)
2. Crear la base de datos:
   ```sql
   CREATE DATABASE base;
   ```
3. Ejecutar el script `base.sql` para crear las tablas y datos iniciales

### Backend (Spring Boot)
1. Navegar al directorio del backend:
   ```bash
   cd projectbackendCompleto/projectbackend
   ```
2. Compilar y ejecutar:
   ```bash
   ./mvnw spring-boot:run
   ```
3. La API estará disponible en http://localhost:8080
4. Documentación Swagger: http://localhost:8080/swagger-ui.html

### Frontend (React)
1. Navegar al directorio del frontend:
   ```bash
   cd myprojectReactCompleto
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Ejecutar en modo desarrollo:
   ```bash
   npm run dev
   ```
4. La aplicación estará disponible en http://localhost:5173

## Credenciales de Prueba
- **Administrador**
  - Email: admin@tienda.com
  - Contraseña: admin123

## Funcionalidades

### Productos
- Listado de productos con paginación
- Creación y edición de productos
- Activación/desactivación de productos
- Gestión de stock
- Subida de imágenes (URL)

### Categorías
- Listado de categorías
- Asignación de productos a categorías

### Usuarios
- Autenticación de usuarios
- Registro de nuevos usuarios
- Roles: admin, vendedor, cliente
- Gestión de perfiles

## Documentación API
La documentación detallada de la API está disponible a través de Swagger UI:
- URL: http://localhost:8080/swagger-ui.html

## Tests
Ejecutar los tests unitarios:
```bash
./mvnw test
```

## Estructura del Proyecto

### Backend
```
src/
├── main/
│   ├── java/
│   │   └── com/vivitasol/projectbackend/
│   │       ├── controllers/
│   │       ├── entities/
│   │       ├── repositories/
│   │       └── services/
│   └── resources/
│       └── application.properties
└── test/
    └── java/
        └── com/vivitasol/projectbackend/
            └── services/
```

### Frontend
```
src/
├── components/
│   ├── CrearProd/
│   ├── EditarProd/
│   ├── Navbar/
│   └── Productos/
├── pages/
│   ├── Auth/
│   ├── Contacto/
│   ├── Home/
│   └── Inventario/
└── App.jsx
```

## Contribución
1. Fork del repositorio
2. Crear una rama para la feature
3. Commit de los cambios
4. Push a la rama
5. Crear Pull Request

## Licencia
Este proyecto está bajo la Licencia MIT.