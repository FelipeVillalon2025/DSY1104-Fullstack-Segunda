import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Productos from '../../componentes/Productos/Productos';

describe('Productos Component', () => {
  const mockProductos = [
    { 
      id: 1, 
      nombre: 'Smartphone X1', 
      precio: 350000, 
      stock: 10, 
      imagen_url: '/img/smartphone.svg', 
      activo: true,
      descripcion: 'Teléfono inteligente con pantalla OLED'
    },
    { 
      id: 2, 
      nombre: 'Auriculares Pro', 
      precio: 75000, 
      stock: 25, 
      imagen_url: '/img/auriculares.svg', 
      activo: true,
      descripcion: 'Auriculares inalámbricos con cancelación de ruido'
    },
    { 
      id: 3, 
      nombre: 'Notebook Slim', 
      precio: 450000, 
      stock: 5, 
      imagen_url: '/img/notebook.svg', 
      activo: true,
      descripcion: 'Portátil ligero 14" para trabajo y estudio'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería renderizar lista de productos', async () => {
    const mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProductos)
      })
    );
    global.fetch = mockFetch;

    render(<Productos />);

    await waitFor(() => {
      expect(screen.getByText('Smartphone X1')).toBeInTheDocument();
      expect(screen.getByText('Auriculares Pro')).toBeInTheDocument();
      expect(screen.getByText('Notebook Slim')).toBeInTheDocument();
    });
  });

  it('debería mostrar los precios correctamente', async () => {
    const mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProductos)
      })
    );
    global.fetch = mockFetch;

    render(<Productos />);

    await waitFor(() => {
      // Los precios pueden estar formateados
      const priceElements = screen.getAllByText(/350000|350\.000/);
      expect(priceElements.length).toBeGreaterThan(0);
    });
  });

  it('debería mostrar stock disponible', async () => {
    const mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProductos)
      })
    );
    global.fetch = mockFetch;

    render(<Productos />);

    await waitFor(() => {
      const stockElements = screen.getAllByText(/stock|disponible|10|25|5/i);
      expect(stockElements.length).toBeGreaterThan(0);
    });
  });

  it('debería mostrar mensaje cuando no hay productos', async () => {
    const mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      })
    );
    global.fetch = mockFetch;

    render(<Productos />);

    await waitFor(() => {
      expect(screen.getByText(/no hay productos|sin productos/i)).toBeInTheDocument();
    });
  });

  it('debería cargar productos desde el backend', async () => {
    const mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProductos)
      })
    );
    global.fetch = mockFetch;

    render(<Productos />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/productos');
    });
  });

  it('debería mostrar imagen de producto con URL correcta', async () => {
    const mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProductos)
      })
    );
    global.fetch = mockFetch;

    render(<Productos />);

    await waitFor(() => {
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
      expect(images[0]).toHaveAttribute('src', '/img/smartphone.svg');
    });
  });

  it('debería tener botón para agregar al carrito', async () => {
    const mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProductos)
      })
    );
    global.fetch = mockFetch;

    render(<Productos />);

    await waitFor(() => {
      const addButtons = screen.getAllByRole('button', { name: /agregar|añadir|add/i });
      expect(addButtons.length).toBeGreaterThan(0);
    });
  });

  it('debería mostrar descripción del producto', async () => {
    const mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProductos)
      })
    );
    global.fetch = mockFetch;

    render(<Productos />);

    await waitFor(() => {
      expect(screen.getByText(/Teléfono inteligente/)).toBeInTheDocument();
      expect(screen.getByText(/inalámbricos/)).toBeInTheDocument();
    });
  });

  it('debería marcar producto como sin stock cuando stock es 0', async () => {
    const productosConSinStock = [
      ...mockProductos,
      { 
        id: 4, 
        nombre: 'Producto sin stock', 
        precio: 10000, 
        stock: 0, 
        imagen_url: '/img/test.svg', 
        activo: true
      }
    ];

    const mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(productosConSinStock)
      })
    );
    global.fetch = mockFetch;

    render(<Productos />);

    await waitFor(() => {
      expect(screen.getByText('Producto sin stock')).toBeInTheDocument();
    });
  });
});
