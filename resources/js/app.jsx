import React from "react";
import { createRoot } from "react-dom/client";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { AppContextProvider, useAppContext } from "./context/AppContext";
import theme from "./utils/theme";

// Import components
import AppLayout from "./layout/AppLayout";
import LoginPage from "./components/auth/LoginPage";
import ProductsPage from "./components/products/ProductsPage";
import OrderDetailsPage from "./components/orders/OrderDetailsPage";
import LoadingSpinner from "./components/common/LoadingSpinner";
import Navbar from "./components/Navbar";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAppContext();

    if (loading) {
        return <LoadingSpinner />;
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (for login when already authenticated)
const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAppContext();

    if (loading) {
        return <LoadingSpinner />;
    }

    return !isAuthenticated ? children : <Navigate to="/" replace />;
};

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppContextProvider>
                <Router>
                    <Navbar />
                    <Routes>
                        {/* Public Routes */}
                        <Route
                            path="/login"
                            element={
                                <PublicRoute>
                                    <LoginPage />
                                </PublicRoute>
                            }
                        />
                        <Route index element={<ProductsPage />} />
                        <Route path="products" element={<ProductsPage />} />
                        
                        {/* Protected Routes */}
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <AppLayout />
                                </ProtectedRoute>
                            }
                        >
                            {/* Nested routes within AppLayout */}
                            {/* <Route index element={<ProductsPage />} />
                            <Route path="products" element={<ProductsPage />} /> */}
                            <Route
                                path="orders/:orderId"
                                element={<OrderDetailsPage />}
                            />
                        </Route>

                        {/* Catch all route - redirect to home */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Router>
            </AppContextProvider>
        </ThemeProvider>
    );
}

// Initialize the React app
const container = document.getElementById("app");
const root = createRoot(container);
root.render(<App />);
