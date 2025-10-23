import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Home } from './pages/Home/Home';
import { Contacto } from './pages/Contacto/Contacto';
import { Inventario } from './pages/Inventario/inventario';
import { CrearProducto } from './componentes/CrearProd/CrearProducto';
import { EditarProd } from './componentes/EditarProd/EditarProd';
import { Login } from './pages/Auth/Login';
import { Cart } from './componentes/Cart/Cart';
import Checkout from './componentes/Checkout/Checkout';
import { PaymentSuccess, PaymentError } from './componentes/PaymentResult/PaymentResult';
import { Shop } from './pages/Shop/Shop';
import { CartProvider } from './context/CartContext';
import './App.css';
import { Productos } from './componentes/Productos/Productos';

function RequireAuth({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
        setLoading(false);
    }, []);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
}

function App() {
    return (
        <CartProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/contacto" element={<Contacto />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/payment-success" element={<PaymentSuccess />} />
                    <Route path="/payment-error" element={<PaymentError />} />
                
                {/* Rutas protegidas */}
                <Route path="/inventario" element={
                    <RequireAuth>
                        <Inventario />
                    </RequireAuth>
                } />
                <Route path="/productos" element={
                    <RequireAuth>
                        <Productos />
                    </RequireAuth>
                } />
                <Route path="/crear-producto" element={
                    <RequireAuth>
                        <CrearProducto />
                    </RequireAuth>
                } />
                <Route path="/editar-producto/:id" element={
                    <RequireAuth>
                        <EditarProd />
                    </RequireAuth>
                } />
                </Routes>
            </Router>
        </CartProvider>
    );
}

export default App;
