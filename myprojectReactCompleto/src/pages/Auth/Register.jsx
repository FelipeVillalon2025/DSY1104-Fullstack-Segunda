import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from "../../componentes/Navbar/Navbar";
import './Register.css';

export function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        nombre: '',
        email: '',
        contrasena: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:8080/api/usuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, rol: 'CLIENTE' })
            });

            if (!response.ok) throw new Error('Error al crear usuario');
            const data = await response.json();
            localStorage.setItem('user', JSON.stringify(data));
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card p-4">
                            <h3>Crear cuenta</h3>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Nombre</label>
                                    <input className="form-control" name="nombre" value={form.nombre} onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Contraseña</label>
                                    <input type="password" className="form-control" name="contrasena" value={form.contrasena} onChange={handleChange} required />
                                </div>
                                <button className="btn btn-primary w-100" type="submit" disabled={loading}>{loading ? 'Creando...' : 'Crear cuenta'}</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
