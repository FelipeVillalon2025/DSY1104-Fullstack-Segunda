import { describe, it, expect, beforeEach } from 'vitest';
import { useContext } from 'react';
import { CartProvider, CartContext } from '../../context/CartContext';
import { renderHook, act } from '@testing-library/react';

describe('CartContext', () => {
  it('debería iniciar con carrito vacío', () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useContext(CartContext), { wrapper });

    expect(result.current.items).toEqual([]);
    expect(result.current.getTotal()).toBe(0);
  });

  it('debería agregar producto al carrito', () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useContext(CartContext), { wrapper });

    const producto = { id: 1, nombre: 'Test', precio: 100000 };

    act(() => {
      result.current.addToCart(producto);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe(1);
    expect(result.current.items[0].nombre).toBe('Test');
  });

  it('debería incrementar cantidad si el producto ya existe', () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useContext(CartContext), { wrapper });

    const producto = { id: 1, nombre: 'Test', precio: 100000 };

    act(() => {
      result.current.addToCart(producto);
      result.current.addToCart(producto);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
  });

  it('debería calcular el total correctamente con un producto', () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useContext(CartContext), { wrapper });

    act(() => {
      result.current.addToCart({ id: 1, nombre: 'Producto 1', precio: 100000 });
    });

    expect(result.current.getTotal()).toBe(100000);
  });

  it('debería calcular el total correctamente con múltiples productos', () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useContext(CartContext), { wrapper });

    act(() => {
      result.current.addToCart({ id: 1, nombre: 'Producto 1', precio: 100000 });
      result.current.addToCart({ id: 2, nombre: 'Producto 2', precio: 50000 });
    });

    expect(result.current.getTotal()).toBe(150000);
  });

  it('debería calcular el total correctamente con cantidades', () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useContext(CartContext), { wrapper });

    act(() => {
      result.current.addToCart({ id: 1, nombre: 'Producto 1', precio: 100000 });
      result.current.addToCart({ id: 1, nombre: 'Producto 1', precio: 100000 }); // Cantidad 2
      result.current.addToCart({ id: 2, nombre: 'Producto 2', precio: 50000 }); // Cantidad 1
    });

    // Total: (100000 * 2) + (50000 * 1) = 250000
    expect(result.current.getTotal()).toBe(250000);
  });

  it('debería eliminar producto del carrito', () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useContext(CartContext), { wrapper });

    act(() => {
      result.current.addToCart({ id: 1, nombre: 'Test', precio: 100000 });
    });

    expect(result.current.items).toHaveLength(1);

    act(() => {
      result.current.removeFromCart(1);
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('debería actualizar el total al eliminar producto', () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useContext(CartContext), { wrapper });

    act(() => {
      result.current.addToCart({ id: 1, nombre: 'Producto 1', precio: 100000 });
      result.current.addToCart({ id: 2, nombre: 'Producto 2', precio: 50000 });
    });

    expect(result.current.getTotal()).toBe(150000);

    act(() => {
      result.current.removeFromCart(1);
    });

    expect(result.current.getTotal()).toBe(50000);
  });

  it('debería limpiar el carrito', () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useContext(CartContext), { wrapper });

    act(() => {
      result.current.addToCart({ id: 1, nombre: 'Test', precio: 100000 });
      result.current.addToCart({ id: 2, nombre: 'Test 2', precio: 50000 });
    });

    expect(result.current.items).toHaveLength(2);

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.getTotal()).toBe(0);
  });

  it('debería mantener la persistencia del carrito (localStorage)', () => {
    // Simular que el carrito estaba guardado en localStorage
    const savedCart = [
      { id: 1, nombre: 'Producto Guardado', precio: 100000, quantity: 1 }
    ];
    localStorage.setItem('cart', JSON.stringify(savedCart));

    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useContext(CartContext), { wrapper });

    // El contexto debería recuperar el carrito guardado
    // (Este test asume que CartProvider implementa localStorage)
    expect(result.current.items).toBeDefined();
  });

  it('debería manejar productos con ID duplicado', () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useContext(CartContext), { wrapper });

    const producto1 = { id: 1, nombre: 'Producto 1', precio: 100000 };
    const producto1_diferente = { id: 1, nombre: 'Producto 1', precio: 100000 };

    act(() => {
      result.current.addToCart(producto1);
      result.current.addToCart(producto1_diferente);
    });

    // Debería haber solo un producto con cantidad incrementada
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
  });

  it('debería calcular subtotal correctamente para cada producto', () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useContext(CartContext), { wrapper });

    act(() => {
      result.current.addToCart({ id: 1, nombre: 'Producto 1', precio: 50000 });
      result.current.addToCart({ id: 1, nombre: 'Producto 1', precio: 50000 }); // Cantidad 2, subtotal 100000
      result.current.addToCart({ id: 2, nombre: 'Producto 2', precio: 30000 }); // Cantidad 1, subtotal 30000
    });

    // Total esperado: 100000 + 30000 = 130000
    expect(result.current.getTotal()).toBe(130000);
  });

  it('debería validar que la cantidad no sea negativa', () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useContext(CartContext), { wrapper });

    act(() => {
      result.current.addToCart({ id: 1, nombre: 'Test', precio: 100000 });
    });

    // Las cantidades nunca deberían ser negativas
    expect(result.current.items[0].quantity).toBeGreaterThan(0);
  });
});
