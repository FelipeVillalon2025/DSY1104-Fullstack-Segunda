  # Projectbackend - API de Gestión de Tienda

  Repositorio con el backend Spring Boot para la gestión de una tienda (productos, categorías, usuarios, órdenes).

  **Contenido entregable**
  - Instrucciones de instalación y ejecución.
  - Documentación de la API (OpenAPI/Swagger disponible).
  - Credenciales de prueba.
  - Scripts SQL para creación de tablas y seed data (`sql/`).
  - Documento ERS en `docs/ERS.pdf`.
  - Documento de testing en `docs/TESTING.md`.

  **Rápido — instalación y ejecución**
  1. Clona el repositorio.
  2. Asegura Java 21 y Maven (o usa el wrapper incluido). En Windows usa `mvnw.cmd`.
  3. Configura la base de datos (MySQL recomendado) y ajusta `src/main/resources/application.properties`.
  4. Ejecuta los scripts SQL en la base de datos: `sql/create_tables.sql` y `sql/seed_data.sql`.
  5. Ejecuta la aplicación:

  ```powershell esto en la carpeta projectbackend
  ./mvnw spring-boot:run
  ```

  o en Windows (si no tienes bash):

  ```powershell
  mvnw.cmd spring-boot:run
  ```

  **URLs útiles (local)**
  - Swagger UI: `http://localhost:8080/swagger-ui.html` o `http://localhost:8080/swagger-ui/index.html`
  - OpenAPI JSON: `http://localhost:8080/v3/api-docs`

  **Credenciales de prueba (por defecto para tests/manual)**
  - Usuario administrador: `admin@mail.com` / `admin123 o felipe123` (ver `sql/seed_data.sql`).
  - Usuario cliente: `prueba1@mail.com` / `felipe123`.

  Si la aplicación utiliza hash de contraseñas al registrar (Spring Security), las contraseñas del seed pueden necesitar ser re-hasheadas.

  Detalles y pasos extendidos en `docs/INSTRUCCIONES.md`.
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