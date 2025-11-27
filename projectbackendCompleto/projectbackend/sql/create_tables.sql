-- Script SQL para crear tablas (MySQL)
CREATE TABLE usuario (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  contrasena VARCHAR(255) NOT NULL,
  rol VARCHAR(50) NOT NULL,
  activo BOOLEAN DEFAULT TRUE,
  creado_en DATETIME
);

CREATE TABLE categoria (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255)
);

CREATE TABLE producto (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255),
  descripcion TEXT,
  precio BIGINT,
  stock INT DEFAULT 0,
  imagen_url VARCHAR(255),
  activo BOOLEAN DEFAULT TRUE,
  categoria_id BIGINT,
  CONSTRAINT fk_producto_categoria FOREIGN KEY (categoria_id) REFERENCES categoria(id) ON DELETE SET NULL
);

CREATE TABLE orden (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  usuario_id BIGINT,
  fecha DATETIME,
  total DOUBLE,
  CONSTRAINT fk_orden_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE SET NULL
);

CREATE TABLE orden_item (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  orden_id BIGINT,
  producto_id BIGINT,
  cantidad INT,
  precio_unitario DOUBLE,
  CONSTRAINT fk_item_orden FOREIGN KEY (orden_id) REFERENCES orden(id) ON DELETE CASCADE,
  CONSTRAINT fk_item_producto FOREIGN KEY (producto_id) REFERENCES producto(id) ON DELETE SET NULL
);
