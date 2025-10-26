import { useState, useEffect } from 'react';
import { Navbar } from '../../componentes/Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Dashboard.css';

export function Dashboard() {
    const [ordenes, setOrdenes] = useState([]);
    const [estadisticas, setEstadisticas] = useState({
        totalCompras: 0,
        totalProductos: 0,
        totalDinero: 0
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const cargarOrdenes = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/ordenes');
                if (!response.ok) {
                    throw new Error('Error al cargar las órdenes');
                }
                const data = await response.json();

                // Ordenar por fecha (desc)
                const ordenesOrdenadas = (data || []).slice().sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
                setOrdenes(ordenesOrdenadas);

                // Calcular estadísticas
                const stats = (ordenesOrdenadas || []).reduce((acc, orden) => {
                    const items = orden.items || [];
                    const productosVendidos = items.reduce((s, it) => s + (it.cantidad || 0), 0);
                    const totalOrden = typeof orden.total === 'number' ? orden.total : items.reduce((s, it) => s + ((it.cantidad || 0) * (it.precioUnitario || 0)), 0);
                    return {
                        totalCompras: acc.totalCompras + 1,
                        totalProductos: acc.totalProductos + productosVendidos,
                        totalDinero: acc.totalDinero + totalOrden
                    };
                }, { totalCompras: 0, totalProductos: 0, totalDinero: 0 });

                setEstadisticas(stats);
            } catch (error) {
                toast.error('Error al cargar las órdenes');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        cargarOrdenes();
        const interval = setInterval(cargarOrdenes, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Navbar />
            <div className="dashboard-container">
                <h2>Dashboard Administrativo</h2>
                
                {loading ? (
                    <div className="loading">Cargando...</div>
                ) : (
                    <>
                        <div className="stats-container">
                            <div className="stat-card">
                                <h3>Total de Compras</h3>
                                <p>{estadisticas.totalCompras}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Productos Vendidos</h3>
                                <p>{estadisticas.totalProductos}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Total Generado</h3>
                                <p>${estadisticas.totalDinero.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="orders-container">
                            <h3>Órdenes Recientes</h3>
                            <div className="table-responsive">
                                <table className="orders-table">
                                    <thead>
                                        <tr>
                                            <th>Usuario</th>
                                            <th>Producto</th>
                                            <th>Cantidad</th>
                                            <th>Total</th>
                                            <th>Fecha</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ordenes.map((orden) => (
                                            orden.items.map((item, index) => (
                                                <tr key={`${orden.id}-${index}`}>
                                                    <td>{orden.usuario.nombre}</td>
                                                    <td>{item.producto.nombre}</td>
                                                    <td>{item.cantidad}</td>
                                                    <td>${(item.cantidad * item.producto.precio).toLocaleString()}</td>
                                                    <td>{new Date(orden.fecha).toLocaleDateString()}</td>
                                                </tr>
                                            ))
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}