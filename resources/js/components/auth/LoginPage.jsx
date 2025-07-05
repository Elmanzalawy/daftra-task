import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    CssBaseline,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Alert,
    CircularProgress,
    Snackbar,
} from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import AppContext, { useAppContext } from "../../context/AppContext";
import { authAPI } from "../../services/apiService";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMsg, setToastMsg] = useState("");

    const { login, setError, error, clearError, isAuthenticated } =
        useAppContext();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/products");
        }
    }, [isAuthenticated, navigate]);

    // Clear errors when component unmounts
    useEffect(() => {
        return () => clearError();
    }, [clearError]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear field error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();

        // Prevent login if already authenticated
        if (isAuthenticated) return;

        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            const response = await authAPI.login(formData);
            const data = response.data.data;
            if (data.token && data.user) {
                login(data.token, data.user);
                navigate("/products");
            } else {
                setError("Invalid response from server");
                setToastMsg("Invalid response from server");
                setToastOpen(true);
            }
        } catch (err) {
            console.error("Login error:", err);
            // Try to extract error message from API response
            let msg = "Login failed. Please check your credentials.";
            if (
                err &&
                err.response &&
                err.response.data &&
                err.response.data.message
            ) {
                msg = err.response.data.message;
            } else if (err && err.message) {
                msg = err.message;
            }
            setError(msg);
            setToastMsg(msg);
            setToastOpen(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container
            component="main"
            maxWidth="lg"
            sx={{ minHeight: "100vh", bgcolor: "#f7f8fa" }}
        >
            <CssBaseline />
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        px: { xs: 1, sm: 6 },
                        py: { xs: 2, sm: 6 },
                        borderRadius: { xs: 2, sm: 4 },
                        boxShadow: "0px 4px 24px rgba(0,0,0,0.06)",
                        maxWidth: 400,
                        width: { xs: "100%", sm: "100%" },
                        bgcolor: "#fff",
                        mx: { xs: 1, sm: 2 },
                        my: { xs: 4, sm: 0 },
                    }}
                >
                    <Typography
                        component="h1"
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            mb: 1,
                            textAlign: "center",
                            fontSize: { xs: 20, sm: 28 },
                        }}
                    >
                        Welcome back
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                            mb: 3,
                            textAlign: "center",
                            fontSize: { xs: 13, sm: 16 },
                        }}
                    >
                        Please enter your details to sign in
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ width: "100%" }}
                    >
                        <Typography
                            variant="subtitle2"
                            sx={{ mb: 0.5, fontWeight: 600, fontSize: 13 }}
                        >
                            Email
                        </Typography>
                        <TextField
                            margin="dense"
                            required
                            fullWidth
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            autoComplete="email"
                            autoFocus
                            value={formData.email}
                            onChange={handleInputChange}
                            error={!!errors.email}
                            helperText={errors.email}
                            disabled={isSubmitting}
                            variant="outlined"
                            size="medium"
                            sx={{ mb: 2 }}
                        />

                        <Typography
                            variant="subtitle2"
                            sx={{ mb: 0.5, fontWeight: 600, fontSize: 13 }}
                        >
                            Password
                        </Typography>
                        <TextField
                            margin="dense"
                            required
                            fullWidth
                            name="password"
                            placeholder="Enter your password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleInputChange}
                            error={!!errors.password}
                            helperText={errors.password}
                            disabled={isSubmitting}
                            variant="outlined"
                            size="medium"
                            sx={{ mb: 3 }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{
                                bgcolor: "#111",
                                color: "#fff",
                                borderRadius: 2,
                                fontWeight: 700,
                                fontSize: 16,
                                py: 1.5,
                                boxShadow: "none",
                                "&:hover": { bgcolor: "#222" },
                                mb: 1,
                            }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <CircularProgress
                                        size={22}
                                        sx={{ color: "#fff", mr: 1 }}
                                    />
                                    Logging in...
                                </>
                            ) : (
                                "Login"
                            )}
                        </Button>
                    </Box>
                </Paper>
            </Box>

            <Snackbar
                open={toastOpen}
                autoHideDuration={4000}
                onClose={() => setToastOpen(false)}
                message={toastMsg}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            />
        </Container>
    );
};

export default LoginPage;
