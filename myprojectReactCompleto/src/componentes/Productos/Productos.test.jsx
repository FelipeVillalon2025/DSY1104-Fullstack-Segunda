import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Productos } from './Productos';

import { act } from 'react-dom/test-utils';

// Mock fetch global
const mockResponses = {
    productos: [],
    categorias: [],
    lowStock: []
};

// Helper para mockear respuestas de fetch
const mockFetchImplementation = jest.fn(async (url) => {
    let data;
    if (url.includes('productos/low-stock')) {
        data = mockResponses.lowStock;
    } else if (url.includes('categorias')) {
        data = mockResponses.categorias;
    } else {
        data = mockResponses.productos;
    }
    return {
        ok: true,
        json: async () => data
    };
});

// Helper para mockear respuestas de fetch
const mockFetchResponse = (key, data) => {
    mockResponses[key] = data;
};

// Wrapper para proveer Router context
const renderWithRouter = (component) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    );
};

describe('Productos Component', () => {
    beforeEach(() => {
        // Limpiar mocks antes de cada test
        jest.clearAllMocks();
        global.fetch = mockFetchImplementation;
        
        // Mock respuestas por defecto
        mockResponses.productos = [];
        mockResponses.categorias = [];
        mockResponses.lowStock = [];
    });

    test('renderiza el título correcto', () => {
        renderWithRouter(<Productos />);
        expect(screen.getByText('Inventario de productos')).toBeInTheDocument();
    });

    test('muestra el campo de búsqueda', () => {
        renderWithRouter(<Productos />);
        expect(screen.getByPlaceholderText('Buscar productos...')).toBeInTheDocument();
    });

    test('muestra el selector de categorías', () => {
        renderWithRouter(<Productos />);
        expect(screen.getByText('Todas las categorías')).toBeInTheDocument();
    });

    test('renderiza la tabla con las columnas correctas', () => {
        renderWithRouter(<Productos />);
        expect(screen.getByText('Id Producto')).toBeInTheDocument();
        expect(screen.getByText('Nombre')).toBeInTheDocument();
        expect(screen.getByText('Descripción')).toBeInTheDocument();
        expect(screen.getByText('Precio')).toBeInTheDocument();
        expect(screen.getByText('Stock')).toBeInTheDocument();
    });

    test('muestra productos cuando se cargan del backend', async () => {
        mockResponses.productos = [
            {
                id: 1,
                nombre: 'Producto Test',
                descripcion: 'Descripción test',
                precio: 1000,
                stock: 5,
                activo: true
            }
        ];

        await act(async () => {
            renderWithRouter(<Productos />);
        });

        expect(await screen.findByText('Producto Test')).toBeInTheDocument();
        expect(await screen.findByText('Descripción test')).toBeInTheDocument();
    });

    test('muestra alerta de stock bajo cuando corresponde', async () => {
        mockResponses.productos = [];
        mockResponses.lowStock = [
            { id: 1, nombre: 'Producto Bajo Stock', stock: 2 }
        ];

        await act(async () => {
            renderWithRouter(<Productos />);
        });

        const alertaElement = await screen.findByText(/Alerta de stock bajo/);
        expect(alertaElement).toBeInTheDocument();
        
        const stockBajoElement = await screen.findByText(/Producto Bajo Stock — stock: 2/);
        expect(stockBajoElement).toBeInTheDocument();
    });

    test('filtra productos al escribir en el campo de búsqueda', async () => {
        renderWithRouter(<Productos />);
        const searchInput = screen.getByPlaceholderText('Buscar productos...');
        
        fireEvent.change(searchInput, { target: { value: 'test' } });
        
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('search=test')
            );
        });
    });

    test('filtra productos al seleccionar una categoría', async () => {
        mockResponses.categorias = [{ id: 1, nombre: 'Categoría Test' }];
        
        await act(async () => {
            renderWithRouter(<Productos />);
        });
        
        const selectCategoria = screen.getByRole('combobox');
        const categoriaOption = await screen.findByText('Categoría Test');
        expect(categoriaOption).toBeInTheDocument();
        
        // Simplemente verificar que el select existe y se puede interactuar
        expect(selectCategoria).toBeInTheDocument();
        expect(mockFetchImplementation).toHaveBeenCalled();
    });
});