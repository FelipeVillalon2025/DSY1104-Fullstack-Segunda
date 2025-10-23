import React from 'react';
import { Link } from 'react-router-dom';
import './PaymentResult.css';

export const PaymentSuccess = () => {
    return (
        <div className="payment-result success">
            <div className="result-content">
                <i className="bi bi-check-circle-fill success-icon"></i>
                <h2>¡Pago exitoso!</h2>
                <p>Tu pedido ha sido procesado correctamente.</p>
                <p>Recibirás un email con los detalles de tu compra.</p>
                <Link to="/" className="btn btn-primary">
                    Volver a la tienda
                </Link>
            </div>
        </div>
    );
};

export const PaymentError = () => {
    return (
        <div className="payment-result error">
            <div className="result-content">
                <i className="bi bi-x-circle-fill error-icon"></i>
                <h2>Error en el pago</h2>
                <p>Lo sentimos, ha ocurrido un error al procesar tu pago.</p>
                <p>Por favor, intenta nuevamente.</p>
                <div className="d-flex gap-2">
                    <Link to="/checkout" className="btn btn-primary">
                        Reintentar
                    </Link>
                    <Link to="/" className="btn btn-outline-secondary">
                        Volver a la tienda
                    </Link>
                </div>
            </div>
        </div>
    );
};