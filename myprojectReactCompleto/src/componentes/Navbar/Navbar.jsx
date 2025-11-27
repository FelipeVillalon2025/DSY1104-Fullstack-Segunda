
import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';

export function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const { getCartItemsCount } = useContext(CartContext) || {};

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const isAdmin = user && (user.rol === 'ADMIN' || user.rol === 'SUPERADMIN');

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('cart');  // Limpiar el carrito al cerrar sesión
        setUser(null);
        window.location.href = '/';  // Usar window.location para forzar recarga completa
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light"> 
            <div className="container"> 
                <Link className="navbar-brand" to="/">Mi Página</Link> 
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"  
                    data-bs-target="#menuNav"> 
                    <span className="navbar-toggler-icon"></span> 
                </button> 
     
                <div className="collapse navbar-collapse" id="menuNav"> 
                    <ul className="navbar-nav me-auto"> 
                        <li className="nav-item"> 
                            <Link className="nav-link" to="/">Home</Link> 
                        </li>
                        <li className="nav-item"> 
                            <Link className="nav-link" to="/shop">Tienda</Link> 
                        </li>  
                        {isAdmin && (
                            <>
                                <li className="nav-item"> 
                                    <Link className="nav-link" to="/inventario">Inventario</Link> 
                                </li>
                                <li className="nav-item"> 
                                    <Link className="nav-link" to="/dashboard">Dashboard</Link> 
                                </li>
                                <li className="nav-item"> 
                                    <Link className="nav-link" to="/usuarios">Usuarios</Link> 
                                </li>
                            </> 
                        )}
                        <li className="nav-item"> 
                            <Link className="nav-link" to="/contacto">Contacto</Link> 
                        </li> 
                    </ul>

                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link position-relative" to="/cart">
                                <i className="bi bi-cart3"></i>
                                {(() => {
                                    const count = typeof getCartItemsCount === 'function' ? getCartItemsCount() : 0;
                                    return count > 0 ? (
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                            {count}
                                        </span>
                                    ) : null;
                                })()}
                            </Link>
                        </li>
                        {user ? (
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i className="bi bi-person-circle me-1"></i>
                                    {user.nombre}
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                    {isAdmin && (
                                        <li>
                                            <Link className="dropdown-item" to="/inventario">
                                                <i className="bi bi-gear me-2"></i>
                                                Gestionar Productos
                                            </Link>
                                        </li>
                                    )}
                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>
                                    <li>
                                        <button className="dropdown-item text-danger" onClick={handleLogout}>
                                            <i className="bi bi-box-arrow-right me-2"></i>
                                            Cerrar Sesión
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">
                                        <i className="bi bi-box-arrow-in-right me-1"></i>
                                        Iniciar Sesión
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">
                                        <i className="bi bi-person-plus me-1"></i>
                                        Crear Cuenta
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div> 
            </div> 
        </nav> 
    );
}
