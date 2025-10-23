import { createContext, useContext, useReducer, useEffect } from 'react';

export const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_ITEM':
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                return {
                    ...state,
                    items: state.items.map(item =>
                        item.id === action.payload.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    )
                };
            }
            return {
                ...state,
                items: [...state.items, { ...action.payload, quantity: 1 }]
            };

        case 'REMOVE_ITEM':
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload)
            };

        case 'UPDATE_QUANTITY':
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                )
            };

        case 'CLEAR_CART':
            return {
                ...state,
                items: []
            };

        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, {
        items: JSON.parse(localStorage.getItem('cart') || '[]')
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(state.items));
    }, [state.items]);

    const addItem = (product) => {
        dispatch({ type: 'ADD_ITEM', payload: product });
    };

    const removeItem = (productId) => {
        dispatch({ type: 'REMOVE_ITEM', payload: productId });
    };

    const updateQuantity = (productId, quantity) => {
        dispatch({
            type: 'UPDATE_QUANTITY',
            payload: { id: productId, quantity }
        });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const getTotal = () => {
        return state.items.reduce((total, item) => total + (item.precio * item.quantity), 0);
    };

    const getCartItemsCount = () => {
        return state.items.reduce((total, item) => total + (item.quantity || 0), 0);
    };

    return (
        <CartContext.Provider value={{
            items: state.items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            getTotal,
            getCartItemsCount
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe ser usado dentro de un CartProvider');
    }
    return context;
};