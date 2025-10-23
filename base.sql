use base;
insert into categoria (nombre) values ("accesorio1");
insert into categoria (nombre) values ("accesorio2");
insert into categoria (nombre) values ("accesorio3");
select * from categoria;


insert into producto(activo, descripcion, nombre, precio, categoria_id) values (true, "producto de alta calidad", "producto1",  1000, 1);
insert into producto(activo, descripcion, nombre, precio, categoria_id) values (true, "producto de alta calidad", "producto2",  2000, 2);
insert into producto(activo, descripcion, nombre, precio, categoria_id) values (true, "producto de alta calidad", "producto3",  1500, 3);
insert into producto(activo, descripcion, nombre, precio, categoria_id) values (true, "producto de alta calidad", "producto4",  1800, 1);
select * from producto;

 