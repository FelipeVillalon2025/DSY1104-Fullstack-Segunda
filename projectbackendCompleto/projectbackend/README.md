# Tienda Virtual - Backend

## Descripción
Backend para una tienda virtual desarrollado con Spring Boot. Proporciona una API REST para gestionar productos, categorías y usuarios.

## Requisitos Previos
- Java 21
- MySQL 8.0
- Maven

## Configuración

### Base de Datos
1. Crear una base de datos MySQL:
```sql
CREATE DATABASE base;
```

2. Configurar las credenciales en `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/base?serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_password
```

## Ejecución

### Desarrollo
```bash
./mvnw spring-boot:run
```

### Producción
```bash
./mvnw clean package
java -jar target/projectbackend-0.0.1-SNAPSHOT.jar
```

## Documentación API
La documentación de la API está disponible a través de Swagger UI:
- URL: http://localhost:8080/swagger-ui/index.html

### Endpoints Principales

#### Autenticación
- POST `/api/auth/login` - Iniciar sesión
- POST `/api/auth/register` - Registrar nuevo usuario

#### Productos
- GET `/api/productos` - Listar todos los productos
- GET `/api/productos/{id}` - Obtener producto por ID
- POST `/api/productos` - Crear nuevo producto
- PUT `/api/productos/{id}` - Actualizar producto
- DELETE `/api/productos/{id}` - Eliminar producto

#### Categorías
- GET `/api/categorias` - Listar todas las categorías
- GET `/api/categorias/{id}` - Obtener categoría por ID
- POST `/api/categorias` - Crear nueva categoría
- PUT `/api/categorias/{id}` - Actualizar categoría
- DELETE `/api/categorias/{id}` - Eliminar categoría

#### Usuarios
- GET `/api/usuarios` - Listar usuarios (admin)
- PUT `/api/usuarios/{id}` - Actualizar usuario
- DELETE `/api/usuarios/{id}` - Eliminar usuario

## Credenciales por Defecto
- **Administrador**
  - Email: admin@tienda.com
  - Contraseña: admin123

## Ejecución de Tests
```bash
./mvnw test
```

## Características
- Autenticación de usuarios
- Gestión de productos y categorías
- Control de stock
- Validación de datos
- Documentación API con Swagger
- Tests unitarios con JUnit y Mockito