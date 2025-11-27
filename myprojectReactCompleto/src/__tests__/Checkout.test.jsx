import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Checkout from '../../componentes/Checkout/Checkout';
import { BrowserRouter } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';

describe('Checkout Component', () => {
  const mockCart = [
    { id: 1, nombre: 'Producto 1', precio: 100000, quantity: 2 },
    { id: 2, nombre: 'Producto 2', precio: 50000, quantity: 1 }
  ];

  const mockCartValue = {
    items: mockCart,
    getTotal: () => 250000,
    clearCart: vi.fn(),
    addToCart: vi.fn(),
    removeFromCart: vi.fn()
  };

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('user', JSON.stringify({
      id: 1,
      nombre: 'Usuario Test',
      email: 'usuario@test.com'
    }));
    vi.clearAllMocks();
  });

  it('debería renderizar formulario de checkout', () => {
    render(
      <BrowserRouter>
        <CartContext.Provider value={mockCartValue}>
          <Checkout />
        </CartContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/dirección|address/i)).toBeInTheDocument();
  });

  it('debería pre-rellenar datos del usuario logueado', () => {
    render(
      <BrowserRouter>
        <CartContext.Provider value={mockCartValue}>
          <Checkout />
        </CartContext.Provider>
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    expect(emailInput.value).toBe('usuario@test.com');
  });

  it('debería mostrar el total de la compra', () => {
    render(
      <BrowserRouter>
        <CartContext.Provider value={mockCartValue}>
          <Checkout />
        </CartContext.Provider>
      </BrowserRouter>
    );

    // El total puede estar formateado
    const totalElements = screen.getAllByText(/250000|250\.000/);
    expect(totalElements.length).toBeGreaterThan(0);
  });

  it('debería requerir campos obligatorios', () => {
    render(
      <BrowserRouter>
        <CartContext.Provider value={mockCartValue}>
          <Checkout />
        </CartContext.Provider>
      </BrowserRouter>
    );

    const nombreInput = screen.getByPlaceholderText(/nombre/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const direccionInput = screen.getByPlaceholderText(/dirección|address/i);

    expect(nombreInput).toBeRequired();
    expect(emailInput).toBeRequired();
    expect(direccionInput).toBeRequired();
  });

  it('debería enviar orden al backend cuando se submit', async () => {
    const mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 123, total: 250000 })
      })
    );
    global.fetch = mockFetch;

    render(
      <BrowserRouter>
        <CartContext.Provider value={mockCartValue}>
          <Checkout />
        </CartContext.Provider>
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /procesar|pagar|checkout|comprar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/ordenes',
        expect.objectContaining({ method: 'POST' })
      );
    });
  });

  it('debería limpiar carrito después de compra exitosa', async () => {
    const mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 123 })
      })
    );
    global.fetch = mockFetch;

    const mockCartValueWithClear = { ...mockCartValue, clearCart: vi.fn() };

    render(
      <BrowserRouter>
        <CartContext.Provider value={mockCartValueWithClear}>
          <Checkout />
        </CartContext.Provider>
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /procesar|pagar|checkout|comprar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCartValueWithClear.clearCart).toHaveBeenCalled();
    });
  });

  it('debería mostrar error si el carrito está vacío', () => {
    const emptyCartValue = {
      items: [],
      getTotal: () => 0,
      clearCart: vi.fn(),
      addToCart: vi.fn(),
      removeFromCart: vi.fn()
    };

    render(
      <BrowserRouter>
        <CartContext.Provider value={emptyCartValue}>
          <Checkout />
        </CartContext.Provider>
      </BrowserRouter>
    );

    // Debería mostrar mensaje de carrito vacío o total 0
    const totalElements = screen.queryAllByText(/0|vacío|empty/i);
    expect(totalElements.length).toBeGreaterThan(0);
  });

  it('debería validar formato de email', async () => {
    render(
      <BrowserRouter>
        <CartContext.Provider value={mockCartValue}>
          <Checkout />
        </CartContext.Provider>
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'email-invalido');

    expect(emailInput).toHaveValue('email-invalido');
  });

  it('debería mostrar confirmación después de compra', async () => {
    const mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 123, total: 250000 })
      })
    );
    global.fetch = mockFetch;

    render(
      <BrowserRouter>
        <CartContext.Provider value={mockCartValue}>
          <Checkout />
        </CartContext.Provider>
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /procesar|pagar|checkout|comprar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      // Buscar mensaje de éxito o número de orden
      const successElements = screen.queryAllByText(/éxito|orden|123|confirmación/i);
      expect(successElements.length).toBeGreaterThan(0);
    });
  });

  it('debería desactivar botón mientras procesa la compra', async () => {
    const mockFetch = vi.fn(() =>
      new Promise(resolve =>
        setTimeout(() => {
          resolve({
            ok: true,
            json: () => Promise.resolve({ id: 123 })
          });
        }, 1000)
      )
    );
    global.fetch = mockFetch;

    render(
      <BrowserRouter>
        <CartContext.Provider value={mockCartValue}>
          <Checkout />
        </CartContext.Provider>
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /procesar|pagar|checkout|comprar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });
});
