import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from "../../componentes/Navbar/Navbar";
import './Login.css';

export function Login() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        email: '',
        contrasena: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });

            if (!response.ok) {
                throw new Error('Credenciales inválidas');
            }

            const userData = await response.json();
            // Normalizar el rol a mayúsculas
            userData.rol = (userData.rol || '').toUpperCase();
            localStorage.setItem('user', JSON.stringify(userData));
            navigate(userData.rol === 'ADMIN' ? '/inventario' : '/shop');

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <>
            <Navbar />
            <div className="login-container">
                <div className="login-card">
                    <h2>Iniciar Sesión</h2>
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-control"
                                value={credentials.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="contrasena">Contraseña</label>
                            <input
                                type="password"
                                id="contrasena"
                                name="contrasena"
                                className="form-control"
                                value={credentials.contrasena}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="btn btn-primary w-100"
                            disabled={loading}
                        >
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}