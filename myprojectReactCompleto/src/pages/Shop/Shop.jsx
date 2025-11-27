import { useEffect, useState } from 'react';
import { Navbar } from '../../componentes/Navbar/Navbar';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';
import './Shop.css';

export function Shop() {
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addItem } = useCart();

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/productos');
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                const data = await response.json();
                // Normalizar campos y eliminar duplicados por id
                const normalized = data.map(p => ({
                    ...p,
                    activo: p.activo === true || p.activo === 'true',
                    imagen_url: p.imagen || p.imagen_url || p.imagenUrl || p.image || null
                }));
                const uniqueById = Array.from(new Map(normalized.map(p => [p.id, p])).values());
                setProductos(uniqueById);
            } catch (err) {
                setError(err.message);
                toast.error(`Error al cargar productos: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        cargarProductos();
    }, []);

    const handleAddToCart = (producto) => {
        addItem(producto);
        toast.success(`${producto.nombre} añadido al carrito`);
    };

    return (
        <>
            <Navbar />
            <div className="container mt-4">
                <h3>Catálogo de productos</h3>
                {loading ? (
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                ) : productos.filter(p => p.activo).length === 0 ? (
                    <div className="alert alert-info" role="alert">
                        No hay productos disponibles en este momento.
                    </div>
                ) : (
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        {productos.filter(p => p.activo).map((producto) => (
                            <div key={producto.id} className="col">
                                <div className="card h-100">
                                    {producto.imagen ? (
                                        <img 
                                            src={producto.imagen} 
                                            className="card-img-top" 
                                            alt={producto.nombre} 
                                            style={{height: '200px', objectFit: 'cover'}}
                                        />
                                    ) : (
                                        <div className="card-img-top d-flex align-items-center justify-content-center bg-light" style={{height: '200px'}}>
                                            <i className="bi bi-image text-muted" style={{fontSize: '3rem'}}></i>
                                        </div>
                                    )}
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">{producto.nombre}</h5>
                                        <p className="card-text flex-grow-1">{producto.descripcion}</p>
                                        <div className="mt-auto">
                                            <p className="card-text">
                                                <strong className="text-primary">${producto.precio}</strong>
                                            </p>
                                            <button 
                                                className="btn btn-primary w-100"
                                                onClick={() => handleAddToCart(producto)}
                                            >
                                                <i className="bi bi-cart-plus me-2"></i>
                                                Añadir al carrito
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
