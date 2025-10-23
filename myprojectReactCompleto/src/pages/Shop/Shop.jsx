import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { toast } from 'react-toastify';
import './Shop.css';

export function Shop() {
    const [productos, setProductos] = useState([]);
    const { addToCart } = useContext(CartContext);
 
    const cargarProductos = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/productos');
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }

            const data = await response.json();
            console.log("Respuesta del backend:", data);

            const productosNormalizados = data.map(p => ({
                ...p,
                activo: p.activo === true || p.activo === 'true',
            }));

            setProductos(productosNormalizados);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
        }
    };
 
    useEffect(() => {
        cargarProductos();
    }, []);

    const handleAddToCart = (producto) => {
        addToCart(producto);
        toast.success(`${producto.nombre} añadido al carrito`);
    };

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
                    toast.success('Producto desactivado exitosamente');
                    cargarProductos();  
                })
                .catch(error => {
                    console.error('Error al desactivar:', error);
                    toast.error('Error al desactivar el producto');
                });
        }
    };

    return (
        <div className="container mt-4">
            <h3 className="mb-4">Catálogo de productos</h3>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {productos.filter(prod => prod.activo).map((prod) => (
                    <div key={prod.id} className="col">
                        <div className="card h-100">
                            {prod.imagen ? (
                                <img 
                                    src={prod.imagen} 
                                    className="card-img-top" 
                                    alt={prod.nombre} 
                                    style={{height: '200px', objectFit: 'cover'}}
                                />
                            ) : (
                                <div className="card-img-top d-flex align-items-center justify-content-center bg-light" style={{height: '200px'}}>
                                    <i className="bi bi-image text-muted" style={{fontSize: '3rem'}}></i>
                                </div>
                            )}
                            <div className="card-body">
                                <h5 className="card-title">{prod.nombre}</h5>
                                <p className="card-text">{prod.descripcion}</p>
                                <p className="card-text">
                                    <strong className="text-primary">${prod.precio}</strong>
                                </p>
                                <button 
                                    className="btn btn-primary w-100"
                                    onClick={() => handleAddToCart(prod)}
                                >
                                    <i className="bi bi-cart-plus me-2"></i>
                                    Agregar al carrito
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}