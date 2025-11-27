-- Seed data de ejemplo
-- Usuarios
INSERT INTO usuario (nombre, email, contrasena, rol, activo, creado_en) VALUES
('Administrador', 'admin@mail.com', 'admin123', 'ADMIN', TRUE, NOW()),
('Cliente', 'cliente@mail.com', '123456', 'CLIENTE', TRUE, NOW());

-- Categorías
INSERT INTO categoria (nombre) VALUES
('Electronica'),
('Ropa'),
('Hogar');

-- Productos
INSERT INTO producto (nombre, descripcion, precio, stock, imagen_url, activo, categoria_id) VALUES
('Auriculares Bluetooth', 'Auriculares inalámbricos con cancelación de ruido', 49990, 10, NULL, TRUE, 1),
('Camiseta Algodón', 'Camiseta unisex 100% algodón', 12990, 25, NULL, TRUE, 2),
('Set de Ollas', 'Set 5 piezas antiadherente', 89990, 5, NULL, TRUE, 3);

-- Orden de ejemplo
INSERT INTO orden (usuario_id, fecha, total) VALUES
(2, NOW(), 62980);

-- Items de la orden (suponiendo ids asignados por insert previos)
INSERT INTO orden_item (orden_id, producto_id, cantidad, precio_unitario) VALUES
(1, 1, 1, 49990.0),
(1, 2, 1, 12990.0);

-- Nota: las contraseñas en este seed son texto plano para pruebas. Si tu aplicación espera hashes,
-- reemplaza `contrasena` por un hash válido (BCrypt) o registra usuarios vía la API.
