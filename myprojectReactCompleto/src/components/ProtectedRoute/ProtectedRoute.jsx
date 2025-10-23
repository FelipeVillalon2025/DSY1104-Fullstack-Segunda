import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }) {
    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user && user.rol === 'ADMIN';

    if (!isAdmin) {
        return <Navigate to="/shop" replace />;
    }

    return children;
}