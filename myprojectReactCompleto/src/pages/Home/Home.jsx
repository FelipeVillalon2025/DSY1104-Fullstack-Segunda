import { useState, useEffect } from 'react';
import { Navbar } from "../../componentes/Navbar/Navbar";
import { Link } from 'react-router-dom';

export function Home() {
    const [productosDestacados, setProductosDestacados] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8080/api/productos')
            .then(response => response.json())
            .then(data => {
                // Normalizar campo de imagen y eliminar duplicados
                const normalized = data.map(p => ({
                    ...p,
                    imagenUrl: p.imagenUrl || p.imagen || p.imagen_url || p.image || null,
                    activo: p.activo === true || p.activo === 'true'
                }));
                const uniqueById = Array.from(new Map(normalized.map(p => [p.id, p])).values());
                // Filtrar solo productos activos y tomar los primeros 3
                const destacados = uniqueById
                    .filter(p => p.activo)
                    .slice(0, 3);
                setProductosDestacados(destacados);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al cargar productos:', error);
                setLoading(false);
            });
    }, []);

    return (
        <>
            <div className="container-fluid p-0">
                <Navbar />
                
                {/* Banner principal */}
                <div className="bg-primary text-white py-5 text-center">
                    <div className="container">
                        <h1 className="display-4">Bienvenido a nuestra tienda</h1>
                        <p className="lead">Descubre nuestra selección de productos de alta calidad</p>
                        <Link to="/shop" className="btn btn-light btn-lg mt-3">
                            Ver Productos
                        </Link>
                    </div>
                </div>

                {/* Sección de productos destacados */}
                <div className="container my-5">
                    <h2 className="text-center mb-4">Productos Destacados</h2>
                    
                    {loading ? (
                        <div className="text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="row">
                            {productosDestacados.map(producto => (
                                <div key={producto.id} className="col-md-4 mb-4">
                                    <div className="card h-100">
                                        {producto.imagenUrl ? (
                                            <img 
                                                src={producto.imagenUrl} 
                                                className="card-img-top"
                                                alt={producto.nombre}
                                                style={{height: "200px", objectFit: "cover"}}
                                            />
                                        ) : (
                                            <div className="bg-light d-flex align-items-center justify-content-center" 
                                                 style={{height: "200px"}}>
                                                <i className="bi bi-image text-muted" style={{fontSize: "3rem"}}></i>
                                            </div>
                                        )}
                                        <div className="card-body">
                                            <h5 className="card-title">{producto.nombre}</h5>
                                            <p className="card-text">{producto.descripcion}</p>
                                            <p className="card-text">
                                                <small className="text-muted">
                                                    Categoría: {producto.categoria?.nombre}
                                                </small>
                                            </p>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="h5 mb-0">${producto.precio}</span>
                                                <Link to="/shop" className="btn btn-outline-primary">
                                                    Ver más
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sección de características */}
                <div className="bg-light py-5">
                    <div className="container">
                        <div className="row g-4">
                            <div className="col-md-4 text-center">
                                <i className="bi bi-truck display-4 text-primary"></i>
                                <h3 className="h5 mt-3">Envío Rápido</h3>
                                <p className="text-muted">Entrega garantizada a todo el país</p>
                            </div>
                            <div className="col-md-4 text-center">
                                <i className="bi bi-shield-check display-4 text-primary"></i>
                                <h3 className="h5 mt-3">Compra Segura</h3>
                                <p className="text-muted">Garantía en todos nuestros productos</p>
                            </div>
                            <div className="col-md-4 text-center">
                                <i className="bi bi-headset display-4 text-primary"></i>
                                <h3 className="h5 mt-3">Soporte 24/7</h3>
                                <p className="text-muted">Atención al cliente permanente</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}