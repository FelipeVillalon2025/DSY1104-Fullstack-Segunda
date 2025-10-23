import React, { useContext, useState } from 'react';
import { CartContext } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
    const { cart, getCartTotal, clearCart } = useContext(CartContext);
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
            // Aquí iría la lógica para procesar el pago
            // Por ahora simulamos un proceso exitoso
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Simular envío de orden
            const orderData = {
                items: cart,
                total: getCartTotal(),
                customerInfo: formData,
                orderDate: new Date().toISOString()
            };

            console.log('Orden procesada:', orderData);
            
            clearCart();
            navigate('/payment-success');
        } catch (error) {
            console.error('Error al procesar el pago:', error);
            navigate('/payment-error');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
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

                            <button 
                                type="submit" 
                                className="btn btn-primary w-100"
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
                            <strong>${getCartTotal().toFixed(2)}</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;