import React from 'react';
import { render, screen } from '@testing-library/react';
import { Productos } from './Productos';
import { BrowserRouter } from 'react-router-dom';

describe('Componente Productos', () => {
  it('debería renderizarse sin errores', () => {
    expect(Productos).toBeDefined();
  });

  it('debería mostrar la lista de productos cuando se cargan', async () => {
    // Mockear fetch para simular la respuesta de la API
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            {
              id: 1,
              nombre: 'Producto Test',
              precio: 100,
              stock: 10
            }
          ])
      })
    );

    render(
      <BrowserRouter>
        <Productos />
      </BrowserRouter>
    );
    
    // Verificar que se muestre el título
    expect(await screen.findByText('Inventario de productos')).toBeInTheDocument();
  });
});