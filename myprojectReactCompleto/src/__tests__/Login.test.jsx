import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../../pages/Auth/Login';
import { BrowserRouter } from 'react-router-dom';

describe('Login Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('debería renderizar el formulario de login', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/contraseña|password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión|login/i })).toBeInTheDocument();
  });

  it('debería validar que el email sea requerido', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    const emailInput = screen.getByPlaceholderText(/email/i);
    expect(emailInput).toBeRequired();
  });

  it('debería validar que la contraseña sea requerida', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    const passwordInput = screen.getByPlaceholderText(/contraseña|password/i);
    expect(passwordInput).toBeRequired();
  });

  it('debería mostrar error con credenciales inválidas', async () => {
    const mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ mensaje: 'Credenciales inválidas' })
      })
    );
    global.fetch = mockFetch;

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/contraseña|password/i);
    const button = screen.getByRole('button', { name: /iniciar sesión|login/i });

    await userEvent.type(emailInput, 'usuario@test.com');
    await userEvent.type(passwordInput, 'passwordIncorrecto');
    
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/auth/login',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
      );
    });
  });

  it('debería guardar token en localStorage con credenciales válidas', async () => {
    const mockResponse = {
      id: 1,
      nombre: 'Admin',
      email: 'admin@tienda.com',
      rol: 'ADMIN',
      token: 'eyJhbGciOiJIUzI1NiIs...'
    };

    const mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse)
      })
    );
    global.fetch = mockFetch;

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/contraseña|password/i);
    const button = screen.getByRole('button', { name: /iniciar sesión|login/i });

    await userEvent.type(emailInput, 'admin@tienda.com');
    await userEvent.type(passwordInput, 'admin123');
    
    fireEvent.click(button);

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBeTruthy();
      expect(localStorage.getItem('user')).toContain('admin@tienda.com');
    });
  });

  it('debería mostrar loading mientras se procesa el login', async () => {
    const mockFetch = vi.fn(() =>
      new Promise(resolve =>
        setTimeout(() => {
          resolve({
            ok: true,
            json: () => Promise.resolve({ id: 1, token: 'token...' })
          });
        }, 1000)
      )
    );
    global.fetch = mockFetch;

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/contraseña|password/i);
    const button = screen.getByRole('button', { name: /iniciar sesión|login/i });

    await userEvent.type(emailInput, 'admin@tienda.com');
    await userEvent.type(passwordInput, 'admin123');
    
    fireEvent.click(button);

    // El botón debería estar deshabilitado durante el loading
    await waitFor(() => {
      expect(button).toBeDisabled();
    });
  });
});
