-- Use or create database 'base'
CREATE DATABASE IF NOT EXISTS base;
USE base;

-- Tabla categorias
CREATE TABLE IF NOT EXISTS categoria (
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
	nombre VARCHAR(255) NOT NULL
);

-- Tabla productos
CREATE TABLE IF NOT EXISTS producto (
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
	activo BOOLEAN DEFAULT TRUE,
	descripcion TEXT,
	nombre VARCHAR(255),
	precio BIGINT,
	stock INT DEFAULT 0,
	imagen_url VARCHAR(1024),
	categoria_id BIGINT,
	FOREIGN KEY (categoria_id) REFERENCES categoria(id)
);

-- Tabla usuarios
CREATE TABLE IF NOT EXISTS usuario (
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
	nombre VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL UNIQUE,
	contrasena VARCHAR(255) NOT NULL,
	rol VARCHAR(50) NOT NULL,
	activo BOOLEAN DEFAULT TRUE,
	fecha_creacion DATETIME
);

-- Seed: categorias (5)
INSERT INTO categoria (nombre) VALUES ('Electrónica'),('Hogar'),('Moda'),('Accesorios'),('Juguetes');

-- Seed: productos (15)
INSERT INTO producto (activo, descripcion, nombre, precio, stock, imagen_url, categoria_id) VALUES
 (true, 'Teléfono inteligente con pantalla OLED', 'Smartphone X1', 350000, 10, '/img/smartphone.svg', 1),
 (true, 'Auriculares inalámbricos con cancelación de ruido', 'Auriculares Pro', 75000, 25, '/img/auriculares.svg', 1),
 (true, 'Portátil ligero 14" para trabajo y estudio', 'Notebook Slim', 450000, 5, '/img/notebook.svg', 1),
 (true, 'Juego de sábanas 200 hilos', 'Sábanas Deluxe', 30000, 12, '/img/sabanas.svg', 2),
 (true, 'Lámpara de escritorio LED', 'Lámpara LED', 12000, 20, '/img/lampara.svg', 2),
 (true, 'Chaqueta impermeable talla M', 'Chaqueta Storm', 85000, 8, '/img/chaqueta.svg', 3),
 (true, 'Reloj de pulsera elegante', 'Reloj Classic', 55000, 4, '/img/reloj.svg', 3),
 (true, 'Bolso de cuero sintético', 'Bolso Urbana', 42000, 15, '/img/bolso.svg', 4),
 (true, 'Gorra de moda', 'Gorra Snap', 8000, 30, '/img/gorra.svg', 4),
 (true, 'Coche de juguete control remoto', 'RC Racer', 22000, 7, '/img/rc.svg', 5),
 (true, 'Construcción magnética 200 piezas', 'Bloques Magnéticos', 18000, 3, '/img/bloques.svg', 5),
 (true, 'Kit de pintura para niños', 'PintaKids', 6000, 18, '/img/pintakids.svg', 5),
 (true, 'Cargador portátil 10000mAh', 'PowerBank 10k', 15000, 22, '/img/powerbank.svg', 1),
 (true, 'Teclado mecánico RGB', 'KeyMaster', 68000, 6, '/img/teclado.svg', 1),
 (true, 'Mouse óptico ergonómico', 'ErgoMouse', 12000, 9, '/img/mouse.svg', 1);

-- Seed: usuario admin (contraseña en texto: admin123) - recomendamos cambiar y encriptar en producción
INSERT INTO usuario (nombre, email, contrasena, rol, activo, fecha_creacion) VALUES
 ('Administrador', 'admin@tienda.com', 'admin123', 'superadmin', true, NOW());

SELECT COUNT(*) as categorias FROM categoria;
SELECT COUNT(*) as productos FROM producto;
SELECT COUNT(*) as usuarios FROM usuario;
 
-- Tablas para órdenes y items de orden
CREATE TABLE IF NOT EXISTS orden (
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
	usuario_id BIGINT NOT NULL,
	fecha DATETIME,
	total DOUBLE,
	CONSTRAINT fk_orden_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE IF NOT EXISTS orden_item (
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
	orden_id BIGINT NOT NULL,
	producto_id BIGINT NOT NULL,
	cantidad INT NOT NULL,
	precio_unitario DOUBLE NOT NULL,
	CONSTRAINT fk_item_orden FOREIGN KEY (orden_id) REFERENCES orden(id),
	CONSTRAINT fk_item_producto FOREIGN KEY (producto_id) REFERENCES producto(id)
);

-- Ejemplo: insertar una orden de prueba (descomentar si quieres cargar datos de ejemplo)
/*
INSERT INTO orden (usuario_id, fecha, total) VALUES (1, NOW(), 45000);
INSERT INTO orden_item (orden_id, producto_id, cantidad, precio_unitario) VALUES (1, 2, 1, 45000);
*/

