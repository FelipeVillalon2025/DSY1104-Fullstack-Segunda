
import { useState } from 'react';
import { Navbar } from "../../componentes/Navbar/Navbar";

export function Contacto() {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        asunto: '',
        mensaje: ''
    });

    const [status, setStatus] = useState({
        submitted: false,
        submitting: false,
        info: { error: false, msg: null }
    });

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = e => {
        e.preventDefault();
        setStatus(prevStatus => ({ ...prevStatus, submitting: true }));
        
        // Aquí simularemos el envío del formulario
        setTimeout(() => {
            setStatus({
                submitted: true,
                submitting: false,
                info: { error: false, msg: '¡Mensaje enviado con éxito!' }
            });
            
            // Limpiar el formulario
            setFormData({
                nombre: '',
                email: '',
                asunto: '',
                mensaje: ''
            });

            // Resetear el mensaje después de 3 segundos
            setTimeout(() => {
                setStatus({
                    submitted: false,
                    submitting: false,
                    info: { error: false, msg: null }
                });
            }, 3000);
        }, 1000);
    };

    return (
        <>
            <div className="container-fluid p-0">
                <Navbar />
                
                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="text-center mb-5">
                                <h2 className="fw-bold">Contáctanos</h2>
                                <p className="text-muted">Estamos aquí para ayudarte. Envíanos tu mensaje.</p>
                            </div>

                            <div className="row mb-5">
                                <div className="col-md-4 text-center mb-3">
                                    <div className="bg-light p-4 rounded-3 h-100">
                                        <i className="bi bi-geo-alt text-primary display-5"></i>
                                        <h5 className="mt-3">Dirección</h5>
                                        <p className="text-muted mb-0">Av. Principal 123, Ciudad</p>
                                    </div>
                                </div>
                                <div className="col-md-4 text-center mb-3">
                                    <div className="bg-light p-4 rounded-3 h-100">
                                        <i className="bi bi-telephone text-primary display-5"></i>
                                        <h5 className="mt-3">Teléfono</h5>
                                        <p className="text-muted mb-0">+56 9 1234 5678</p>
                                    </div>
                                </div>
                                <div className="col-md-4 text-center mb-3">
                                    <div className="bg-light p-4 rounded-3 h-100">
                                        <i className="bi bi-envelope text-primary display-5"></i>
                                        <h5 className="mt-3">Email</h5>
                                        <p className="text-muted mb-0">contacto@tienda.com</p>
                                    </div>
                                </div>
                            </div>

                            <div className="card shadow-sm">
                                <div className="card-body p-4">
                                    {status.info.msg && (
                                        <div className={`alert ${status.info.error ? 'alert-danger' : 'alert-success'} mb-4`}>
                                            {status.info.msg}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="nombre" className="form-label">Nombre</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="nombre"
                                                    name="nombre"
                                                    value={formData.nombre}
                                                    onChange={handleChange}
                                                    required
                                                    disabled={status.submitting}
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="email" className="form-label">Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    disabled={status.submitting}
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="asunto" className="form-label">Asunto</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="asunto"
                                                name="asunto"
                                                value={formData.asunto}
                                                onChange={handleChange}
                                                required
                                                disabled={status.submitting}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="mensaje" className="form-label">Mensaje</label>
                                            <textarea
                                                className="form-control"
                                                id="mensaje"
                                                name="mensaje"
                                                rows="5"
                                                value={formData.mensaje}
                                                onChange={handleChange}
                                                required
                                                disabled={status.submitting}
                                            ></textarea>
                                        </div>
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary"
                                            disabled={status.submitting}
                                        >
                                            {status.submitting ? 'Enviando...' : 'Enviar Mensaje'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}