import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import { Navbar } from '../Navbar/Navbar';
import './Cart.css';

export function Cart() {
    const { items, removeItem, updateQuantity, clearCart, getTotal } = useCart();

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity >= 1) {
            updateQuantity(productId, parseInt(newQuantity));
        }
    };

    if (items.length === 0) {
        return (
            <>
                <Navbar />
                <div className="container mt-5 text-center">
                    <div className="empty-cart">
                        <i className="bi bi-cart-x display-1 text-muted"></i>
                        <h2>Tu carrito está vacío</h2>
                        <p className="text-muted">¿No sabes qué comprar? ¡Miles de productos te esperan!</p>
                        <Link to="/" className="btn btn-primary">
                            Ir a comprar
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container mt-4">
                <h2 className="mb-4">Carrito de Compras</h2>
                
                <div className="row">
                    <div className="col-md-8">
                        <div className="cart-items">
                            {items.map((item) => (
                                <div key={item.id} className="cart-item">
                                    <div className="item-image">
                                        {item.imagenUrl ? (
                                            <img src={item.imagenUrl} alt={item.nombre} />
                                        ) : (
                                            <div className="placeholder-image">
                                                <i className="bi bi-image"></i>
                                            </div>
                                        )}
                                    </div>
                                    <div className="item-details">
                                        <h5>{item.nombre}</h5>
                                        <p className="text-muted">{item.descripcion}</p>
                                        <p className="price">${item.precio}</p>
                                    </div>
                                    <div className="item-quantity">
                                        <div className="quantity-control">
                                            <button 
                                                className="btn btn-outline-secondary btn-sm"
                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                                className="form-control"
                                            />
                                            <button 
                                                className="btn btn-outline-secondary btn-sm"
                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className="item-subtotal">
                                        <p className="mb-0">Subtotal:</p>
                                        <strong>${item.precio * item.quantity}</strong>
                                    </div>
                                    <div className="item-actions">
                                        <button 
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => removeItem(item.id)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="cart-actions mt-3">
                            <button 
                                className="btn btn-outline-secondary"
                                onClick={clearCart}
                            >
                                Limpiar Carrito
                            </button>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="cart-summary">
                            <h4>Resumen de la Compra</h4>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Subtotal</span>
                                <span>${getTotal()}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Envío</span>
                                <span>Gratis</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between mb-3">
                                <strong>Total</strong>
                                <strong>${getTotal()}</strong>
                            </div>
                            <Link 
                                to="/checkout" 
                                className="btn btn-primary w-100"
                            >
                                Comprar Ahora
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}