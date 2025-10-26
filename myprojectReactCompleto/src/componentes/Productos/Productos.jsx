import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Productos.css';

export function Productos() {

    const [productos, setProductos] = useState([]);
 
    const cargarProductos = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/productos');
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }

            const data = await response.json();
            console.log("Respuesta del backend:", data);

            // Normalizar campos y eliminar duplicados por id
            const normalized = data.map(p => ({
                ...p,
                activo: p.activo === true || p.activo === 'true',
                imagen_url: p.imagen || p.imagen_url || p.imagenUrl || p.image || null
            }));
            const uniqueById = Array.from(new Map(normalized.map(p => [p.id, p])).values());

            setProductos(uniqueById);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
        }
    };
 
    useEffect(() => {
        cargarProductos();
    }, []);

    const handleDesactivar = (id, nombre) => {
        if (window.confirm(`¿Estás seguro de desactivar el producto "${nombre}"?`)) {
            fetch(`http://localhost:8080/api/productos/${id}/desactivar`, {
                method: 'PATCH'
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al desactivar el producto');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Producto desactivado:', data);
                    alert('Producto desactivado exitosamente');
                    cargarProductos();  
                })
                .catch(error => {
                    console.error('Error al desactivar:', error);
                    alert('Error al desactivar el producto');
                });
        }
    };

    const handleActivar = (id, nombre) => {
        if (window.confirm(`¿Estás seguro de activar el producto "${nombre}"?`)) {
            fetch(`http://localhost:8080/api/productos/${id}/activar`, {
                method: 'PATCH'
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al activar el producto');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Producto activado:', data);
                    alert('Producto activado exitosamente');
                    cargarProductos();  
                })
                .catch(error => {
                    console.error('Error al activar:', error);
                    alert('Error al activar el producto');
                });
        }
    };

    return (
        <>
            <div className="container mi-tabla">
                <h3 style={{ marginBottom: '20px' }}>Inventario de productos</h3>
                <div className="row mb-3">
                    <div className="col-12 text-end">
                        <Link className="btn btn-outline-dark"
                            style={{ fontSize: '13px' }} to="/crear-producto">Crear Producto</Link>
                    </div>
                </div>


                <div className="row">
                    <div className="col-md">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Imagen</th>
                                    <th>Id Producto</th>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th>Editar Producto</th>
                                    <th>Desactivar/Eliminar </th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.map((prod) => (
                                    <tr key={prod.id}
                                        style={{ opacity: prod.activo ? 1 : 0.5,
                                            backgroundColor: prod.activo ? 'white' : '#f8f8f8'}}>
                                        <td>
                                            {prod.imagen_url ? (
                                                <img src={prod.imagen_url} alt={prod.nombre} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                                            ) : (
                                                <div style={{ width: '80px', height: '60px', background: '#f0f0f0' }} />
                                            )}
                                        </td>
                                        <td>{prod.id}</td>
                                        <td>{prod.nombre}</td>
                                        <td>{prod.descripcion}</td>
                                        <td>${prod.precio.toLocaleString()}</td>
                                        <td>{prod.stock || 0}</td>
                                        <td>
                                            {prod.activo ? (
                                                <Link className="btn btn-outline-primary"
                                                    style={{ fontSize: '13px' }}
                                                    to={`/editar-producto/${prod.id}`}>
                                                    Editar Producto
                                                </Link>
                                            ) : (
                                                <button className="btn btn-outline-secondary"
                                                    style={{ cursor: 'not-allowed',
                                                        pointerEvents: 'none',}}
                                                    disabled>
                                                    Editar Producto
                                                </button>
                                            )}
                                        </td>
                                        <td>
                                            {prod.activo ? (
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDesactivar(prod.id, prod.nombre)}>
                                                    Desactivar
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-sm btn-outline-success"
                                                    onClick={() => handleActivar(prod.id, prod.nombre)}>
                                                    Activar
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}