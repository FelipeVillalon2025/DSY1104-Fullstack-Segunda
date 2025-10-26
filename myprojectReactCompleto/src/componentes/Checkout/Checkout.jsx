import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
    const { items: cart, getTotal, clearCart } = useContext(CartContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        direccion: '',
        ciudad: '',
        codigoPostal: '',
        telefono: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Autofill desde usuario en localStorage si existe
        try {
            const raw = localStorage.getItem('user');
            if (raw) {
                const user = JSON.parse(raw);
                setFormData(prev => ({
                    ...prev,
                    nombre: user.nombre || user.name || prev.nombre,
                    email: user.email || prev.email,
                    direccion: user.direccion || user.address || prev.direccion,
                    ciudad: user.ciudad || user.city || prev.ciudad,
                    codigoPostal: user.codigoPostal || user.postalCode || prev.codigoPostal,
                    telefono: user.telefono || user.phone || prev.telefono
                }));
            }
        } catch (err) {
            console.warn('No se pudo leer user de localStorage para autofill', err);
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            if (!userData) {
                throw new Error('Usuario no autenticado');
            }

            // Crear la orden
            const orderData = {
                usuario: { id: userData.id },
                total: getTotal(),
                fecha: new Date().toISOString(),
                items: cart.map(item => ({
                    producto: { id: item.id },
                    cantidad: item.quantity,
                    precioUnitario: item.precio
                }))
            };

            // Enviar la orden al backend
            const response = await fetch('http://localhost:8080/api/ordenes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                throw new Error('Error al crear la orden');
            }

            // La reducción del stock se maneja automáticamente en el backend al crear la orden
            await fetch('http://localhost:8080/api/ordenes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    usuario: { id: userData.id },
                    items: cart.map(item => ({
                        producto: { id: item.id },
                        cantidad: item.quantity,
                        precioUnitario: item.precio
                    }))
                })
            });
            
            clearCart();
            navigate('/payment-success');
        } catch (error) {
            console.error('Error al procesar el pago:', error);
            navigate('/payment-error');
        } finally {
            setLoading(false);
        }
    };

    if (!cart || cart.length === 0) {
        navigate('/');
        return null;
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-8">
                    <div className="checkout-form p-4">
                        <h2 className="mb-4">Información de envío</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Nombre completo</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Dirección</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="direccion"
                                    value={formData.direccion}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Ciudad</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="ciudad"
                                        value={formData.ciudad}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Código Postal</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="codigoPostal"
                                        value={formData.codigoPostal}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label">Teléfono</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="d-flex gap-2">
                                <button 
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => navigate('/cart')}
                                    disabled={loading}
                                >
                                    Volver al Carrito
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary flex-grow-1"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Procesando...
                                        </>
                                    ) : (
                                        'Confirmar Pedido'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="order-summary p-4">
                        <h3>Resumen del pedido</h3>
                        <div className="order-items">
                            {cart.map(item => (
                                <div key={item.id} className="order-item">
                                    <div className="d-flex justify-content-between">
                                        <span>{item.nombre} x {item.quantity}</span>
                                        <span>${(item.precio * item.quantity).toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between">
                            <strong>Total:</strong>
                            <strong>${getTotal().toFixed(2)}</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;