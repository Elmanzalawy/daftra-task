import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiService, authAPI, productsAPI, ordersAPI } from '../services/apiService';

// Initial state
const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
    cart: [],
    products: [],
    orders: [],
    error: null
};

// Action types
const ActionTypes = {
    SET_LOADING: 'SET_LOADING',
    SET_USER: 'SET_USER',
    SET_ERROR: 'SET_ERROR',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGOUT: 'LOGOUT',
    ADD_TO_CART: 'ADD_TO_CART',
    REMOVE_FROM_CART: 'REMOVE_FROM_CART',
    UPDATE_CART_QUANTITY: 'UPDATE_CART_QUANTITY',
    CLEAR_CART: 'CLEAR_CART',
    SET_PRODUCTS: 'SET_PRODUCTS',
    SET_ORDERS: 'SET_ORDERS',
    CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer
const appReducer = (state, action) => {
    switch (action.type) {
        case ActionTypes.SET_LOADING:
            return {
                ...state,
                loading: action.payload
            };
        case ActionTypes.SET_USER:
            return {
                ...state,
                user: action.payload,
                isAuthenticated: !!action.payload,
                loading: false
            };
        case ActionTypes.SET_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false
            };
        case ActionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                loading: false,
                error: null
            };
        case ActionTypes.LOGOUT:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                cart: [],
                error: null
            };
        case ActionTypes.ADD_TO_CART:
            const existingItem = state.cart.find(item => item.id === action.payload.id);
            if (existingItem) {
                return {
                    ...state,
                    cart: state.cart.map(item =>
                        item.id === action.payload.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    )
                };
            }
            return {
                ...state,
                cart: [...state.cart, { ...action.payload, quantity: 1 }]
            };
        case ActionTypes.REMOVE_FROM_CART:
            return {
                ...state,
                cart: state.cart.filter(item => item.id !== action.payload)
            };
        case ActionTypes.UPDATE_CART_QUANTITY:
            return {
                ...state,
                cart: state.cart.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                )
            };
        case ActionTypes.CLEAR_CART:
            return {
                ...state,
                cart: []
            };
        case ActionTypes.SET_PRODUCTS:
            return {
                ...state,
                products: action.payload
            };
        case ActionTypes.SET_ORDERS:
            return {
                ...state,
                orders: action.payload
            };
        case ActionTypes.CLEAR_ERROR:
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
};

// Create context
const AppContext = createContext();

// Context provider
export const AppContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    // Actions
    const setLoading = (loading) => {
        dispatch({ type: ActionTypes.SET_LOADING, payload: loading });
    };

    const setError = (error) => {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error });
    };

    const clearError = () => {
        dispatch({ type: ActionTypes.CLEAR_ERROR });
    };

    const login = async (credentials) => {
        try {
            setLoading(true);
            const response = await authAPI.login(credentials);
            dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: response.data.user });
            
            // Store token in localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            return response.data;
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            dispatch({ type: ActionTypes.LOGOUT });
        }
    };

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                dispatch({ type: ActionTypes.SET_USER, payload: null });
                return;
            }

            const response = await authAPI.getUser();
            dispatch({ type: ActionTypes.SET_USER, payload: response.data });
        } catch (error) {
            console.error('Fetch user error:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            dispatch({ type: ActionTypes.SET_USER, payload: null });
        }
    };

    const addToCart = (product) => {
        dispatch({ type: ActionTypes.ADD_TO_CART, payload: product });
    };

    const removeFromCart = (productId) => {
        dispatch({ type: ActionTypes.REMOVE_FROM_CART, payload: productId });
    };

    const updateCart = (productId, quantity) => {
        console.log('updating cart quantity', productId, quantity)
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            dispatch({ 
                type: ActionTypes.UPDATE_CART_QUANTITY, 
                payload: { id: productId, quantity } 
            });
        }
    };

    const clearCart = () => {
        dispatch({ type: ActionTypes.CLEAR_CART });
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productsAPI.getAll();
            dispatch({ type: ActionTypes.SET_PRODUCTS, payload: response.data });
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await ordersAPI.getAll();
            dispatch({ type: ActionTypes.SET_ORDERS, payload: response.data });
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    // Check for existing token on app start
    useEffect(() => {
        fetchUser();
    }, []);

    const value = {
        // State
        ...state,
        
        // Actions
        setLoading,
        setError,
        clearError,
        login,
        logout,
        fetchUser,
        addToCart,
        removeFromCart,
        updateCart,
        clearCart,
        fetchProducts,
        fetchOrders
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

// Custom hook to use the context
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
};

export default AppContext;