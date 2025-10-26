import { useState, useEffect } from 'react';
import { Navbar } from '../../componentes/Navbar/Navbar';
import { toast } from 'react-toastify';
import './GestionUsuarios.css';

export function GestionUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editandoUsuario, setEditandoUsuario] = useState(null);
    const [nuevoUsuario, setNuevoUsuario] = useState({
        nombre: '',
        email: '',
        contrasena: '',
        rol: 'CLIENTE'
    });

    const cargarUsuarios = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/usuarios');
            if (!response.ok) throw new Error('Error al cargar usuarios');
            const data = await response.json();
            setUsuarios(data);
        } catch (error) {
            toast.error('Error al cargar los usuarios');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/usuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoUsuario)
            });

            if (!response.ok) throw new Error('Error al crear usuario');
            toast.success('Usuario creado exitosamente');
            setNuevoUsuario({
                nombre: '',
                email: '',
                contrasena: '',
                rol: 'CLIENTE'
            });
            cargarUsuarios();
        } catch (error) {
            toast.error('Error al crear el usuario');
            console.error(error);
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/api/usuarios/${editandoUsuario.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editandoUsuario)
            });

            if (!response.ok) throw new Error('Error al actualizar usuario');
            toast.success('Usuario actualizado exitosamente');
            setEditandoUsuario(null);
            cargarUsuarios();
        } catch (error) {
            toast.error('Error al actualizar el usuario');
            console.error(error);
        }
    };

    const handleDesactivar = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/usuarios/${id}/desactivar`, {
                method: 'PUT'
            });

            if (!response.ok) throw new Error('Error al desactivar usuario');
            toast.success('Usuario desactivado exitosamente');
            cargarUsuarios();
        } catch (error) {
            toast.error('Error al desactivar el usuario');
            console.error(error);
        }
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <>
            <Navbar />
            <div className="gestion-usuarios-container">
                <h2>Gestión de Usuarios</h2>

                {/* Formulario de nuevo usuario */}
                <div className="nuevo-usuario-form">
                    <h3>Crear Nuevo Usuario</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Nombre:</label>
                            <input
                                type="text"
                                value={nuevoUsuario.nombre}
                                onChange={e => setNuevoUsuario({...nuevoUsuario, nombre: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                value={nuevoUsuario.email}
                                onChange={e => setNuevoUsuario({...nuevoUsuario, email: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Contraseña:</label>
                            <input
                                type="password"
                                value={nuevoUsuario.contrasena}
                                onChange={e => setNuevoUsuario({...nuevoUsuario, contrasena: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Rol:</label>
                            <select
                                value={nuevoUsuario.rol}
                                onChange={e => setNuevoUsuario({...nuevoUsuario, rol: e.target.value})}
                            >
                                <option value="CLIENTE">Cliente</option>
                                <option value="VENDEDOR">Vendedor</option>
                                <option value="ADMIN">Administrador</option>
                            </select>
                        </div>
                        <button type="submit">Crear Usuario</button>
                    </form>
                </div>

                {/* Lista de usuarios */}
                <div className="usuarios-list">
                    <h3>Usuarios Existentes</h3>
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Rol</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map(usuario => (
                                    <tr key={usuario.id}>
                                        <td>{usuario.nombre}</td>
                                        <td>{usuario.email}</td>
                                        <td>{usuario.rol}</td>
                                        <td>{usuario.activo ? 'Activo' : 'Inactivo'}</td>
                                        <td>
                                            <button
                                                onClick={() => setEditandoUsuario(usuario)}
                                                className="btn-editar"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDesactivar(usuario.id)}
                                                className="btn-desactivar"
                                                disabled={!usuario.activo}
                                            >
                                                Desactivar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal de edición */}
                {editandoUsuario && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>Editar Usuario</h3>
                            <form onSubmit={handleEdit}>
                                <div className="form-group">
                                    <label>Nombre:</label>
                                    <input
                                        type="text"
                                        value={editandoUsuario.nombre}
                                        onChange={e => setEditandoUsuario({
                                            ...editandoUsuario,
                                            nombre: e.target.value
                                        })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email:</label>
                                    <input
                                        type="email"
                                        value={editandoUsuario.email}
                                        onChange={e => setEditandoUsuario({
                                            ...editandoUsuario,
                                            email: e.target.value
                                        })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Contraseña: (dejar en blanco para mantener)</label>
                                    <input
                                        type="password"
                                        value={editandoUsuario.contrasena || ''}
                                        onChange={e => setEditandoUsuario({
                                            ...editandoUsuario,
                                            contrasena: e.target.value
                                        })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Rol:</label>
                                    <select
                                        value={editandoUsuario.rol}
                                        onChange={e => setEditandoUsuario({
                                            ...editandoUsuario,
                                            rol: e.target.value
                                        })}
                                    >
                                        <option value="CLIENTE">Cliente</option>
                                        <option value="VENDEDOR">Vendedor</option>
                                        <option value="ADMIN">Administrador</option>
                                    </select>
                                </div>
                                <div className="modal-buttons">
                                    <button type="submit">Guardar</button>
                                    <button type="button" onClick={() => setEditandoUsuario(null)}>
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}