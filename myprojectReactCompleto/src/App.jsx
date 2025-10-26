import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Home } from './pages/Home/Home';
import { Contacto } from './pages/Contacto/Contacto';
import { Inventario } from './pages/Inventario/inventario';
import { CrearProducto } from './componentes/CrearProd/CrearProducto';
import { EditarProd } from './componentes/EditarProd/EditarProd';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { Cart } from './componentes/Cart/Cart';
import Checkout from './componentes/Checkout/Checkout';
import { PaymentSuccess, PaymentError } from './componentes/PaymentResult/PaymentResult';
import { Shop } from './pages/Shop/Shop';
import { CartProvider } from './context/CartContext';
import { Dashboard } from './pages/Dashboard/Dashboard';
import './App.css';
import { Productos } from './componentes/Productos/Productos';
import { GestionUsuarios } from './pages/Usuarios/GestionUsuarios';

function RequireAuth({ children, requireAdmin }) {
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

    const isAdmin = user.rol === 'ADMIN' || user.rol === 'SUPERADMIN';
    if (requireAdmin && !isAdmin) {
        return <Navigate to="/shop" />;
    }

    return children;
}

function App() {
    return (
        <CartProvider>
            <Router>
                <ToastContainer position="top-right" autoClose={3000} />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/contacto" element={<Contacto />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/payment-success" element={<PaymentSuccess />} />
                    <Route path="/payment-error" element={<PaymentError />} />
                    <Route path="/usuarios" element={
                        <RequireAuth requireAdmin={true}>
                            <GestionUsuarios />
                        </RequireAuth>
                    } />
                    
                {/* Rutas protegidas */}
                <Route path="/dashboard" element={
                    <RequireAuth requireAdmin={true}>
                        <Dashboard />
                    </RequireAuth>
                } />
                <Route path="/inventario" element={
                    <RequireAuth requireAdmin={true}>
                        <Inventario />
                    </RequireAuth>
                } />
                <Route path="/productos" element={
                    <RequireAuth requireAdmin={true}>
                        <Productos />
                    </RequireAuth>
                } />
                <Route path="/crear-producto" element={
                    <RequireAuth requireAdmin={true}>
                        <CrearProducto />
                    </RequireAuth>
                } />
                <Route path="/editar-producto/:id" element={
                    <RequireAuth requireAdmin={true}>
                        <EditarProd />
                    </RequireAuth>
                } />
                </Routes>
            </Router>
        </CartProvider>
    );
}

export default App;
