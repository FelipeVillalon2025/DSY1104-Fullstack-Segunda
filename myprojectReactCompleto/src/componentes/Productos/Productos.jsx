import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Productos.css';

export function Productos() {

    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const [search, setSearch] = useState('');
    const [lowStockItems, setLowStockItems] = useState([]);
 
    const cargarProductos = async (opts = {}) => {
        try {
            // Construir URL con parámetros opcionales (search, categoriaId)
            const params = new URLSearchParams();
            if (opts.search) params.append('search', opts.search);
            if (opts.categoriaId) params.append('categoriaId', opts.categoriaId);
            const url = `http://localhost:8080/api/productos${params.toString() ? ('?' + params.toString()) : ''}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }

            const data = await response.json();
            console.log("Respuesta del backend:", data);

            // Normalizar campos y eliminar duplicados por id
            const normalized = data.map(p => ({
                ...p,
                activo: p.activo === true || p.activo === 'true',
                imagen_url: p.imagen || p.imagen_url || p.imagenUrl || p.image || p.imagenUrl || null
            }));
            const uniqueById = Array.from(new Map(normalized.map(p => [p.id, p])).values());

            setProductos(uniqueById);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
        }
    };
 
    // Cargar productos al montar y cuando cambien search o categoriaSeleccionada (debounced)
    useEffect(() => {
        const handler = setTimeout(() => {
            cargarProductos({ search: search || undefined, categoriaId: categoriaSeleccionada || undefined });
        }, 300); // debounce 300ms
        return () => clearTimeout(handler);
    }, [search, categoriaSeleccionada]);

    // Cargar categorías
    useEffect(() => {
        const cargarCategorias = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/categorias');
                if (!res.ok) throw new Error('Error al obtener categorias');
                const d = await res.json();
                setCategorias(d);
            } catch (e) {
                console.error('Categorias:', e);
            }
        };
        cargarCategorias();
    }, []);

    // Polling para alertas de stock bajo cada 30s
    useEffect(() => {
        let mounted = true;
        const checkLowStock = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/productos/low-stock?threshold=3');
                if (!res.ok) return;
                const d = await res.json();
                if (mounted) setLowStockItems(d);
            } catch (e) {
                console.error('Error al verificar stock bajo', e);
            }
        };
        // check inmediato y luego intervalo
        checkLowStock();
        const id = setInterval(checkLowStock, 30000);
        return () => { mounted = false; clearInterval(id); };
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

    const handleCategoriaChange = (e) => {
        setCategoriaSeleccionada(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    return (
        <>
            <div className="container mi-tabla">
                <h3 style={{ marginBottom: '20px' }}>Inventario de productos</h3>
                <div className="row mb-3">
                    <div className="col-md-4">
                        <input type="text" className="form-control" placeholder="Buscar productos..." value={search} onChange={handleSearchChange} />
                    </div>
                    <div className="col-md-3">
                        <select className="form-select" value={categoriaSeleccionada} onChange={handleCategoriaChange}>
                            <option value="">Todas las categorías</option>
                            {categorias.map(c => (
                                <option key={c.id} value={c.id}>{c.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-12 col-md-5 text-end">
                        <Link className="btn btn-outline-dark"
                            style={{ fontSize: '13px' }} to="/crear-producto">Crear Producto</Link>
                    </div>
                </div>

                {lowStockItems && lowStockItems.length > 0 && (
                    <div className="alert alert-warning" role="alert">
                        <strong>Alerta de stock bajo:</strong> {lowStockItems.length} producto(s) con stock ≤ 3. Revisa el inventario.
                        <ul style={{ marginTop: '8px' }}>
                            {lowStockItems.map(p => (
                                <li key={p.id}>{p.nombre} — stock: {p.stock}</li>
                            ))}
                        </ul>
                    </div>
                )}


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