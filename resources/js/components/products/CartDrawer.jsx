import React, { useState, useContext } from 'react';
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Divider,
  TextField,
  Alert,
  Avatar,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as CartIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useAppContext } from '../../context/AppContext';
import { apiService } from '../../services/apiService';

const CartDrawer = ({ open, onClose, cart, updateCart }) => {
  const { user } = useAppContext();
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(false);

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }

    const updatedCart = cart.map(item =>
      item.id === productId
        ? { ...item, quantity: Math.max(1, Math.min(newQuantity, item.stock)) }
        : item
    );
    updateCart(updatedCart);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    updateCart(updatedCart);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const calculateTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleSubmitOrder = async () => {
    if (cart.length === 0) return;

    try {
      setSubmitting(true);
      setOrderError(null);

      const orderData = {
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total: calculateTotal()
      };

      const response = await apiService.post('/orders', orderData);
      
      // Clear cart and show success
      updateCart([]);
      setOrderSuccess(true);
      setConfirmDialog(false);
      
      // Auto-close success dialog after 3 seconds
      setTimeout(() => {
        setOrderSuccess(false);
        onClose();
      }, 3000);

    } catch (err) {
      setOrderError('Failed to submit order. Please try again.');
      console.error('Error submitting order:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const CartItem = ({ item }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={item.image || '/placeholder-product.jpg'}
            alt={item.name}
            sx={{ width: 60, height: 60 }}
            variant="rounded"
          />
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" noWrap>
              {item.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ${item.price} each
            </Typography>
            <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
              Subtotal: ${(item.price * item.quantity).toFixed(2)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            {/* Quantity Controls */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                size="small"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <RemoveIcon />
              </IconButton>
              
              <TextField
                size="small"
                value={item.quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1;
                  updateQuantity(item.id, value);
                }}
                inputProps={{ 
                  min: 1,
                  max: item.stock,
                  style: { textAlign: 'center', width: '50px' }
                }}
                sx={{ mx: 1 }}
              />
              
              <IconButton
                size="small"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                disabled={item.quantity >= item.stock}
              >
                <AddIcon />
              </IconButton>
            </Box>

            {/* Remove Button */}
            <IconButton
              size="small"
              onClick={() => removeFromCart(item.id)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 400 } }
        }}
      >
        <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CartIcon sx={{ mr: 1 }} />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Shopping Cart ({calculateTotalItems()})
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Cart Items */}
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            {cart.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CartIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Your cart is empty
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add some products to get started!
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {cart.map((item) => (
                  <ListItem key={item.id} sx={{ p: 0, mb: 1 }}>
                    <CartItem item={item} />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>

          {/* Footer */}
          {cart.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">
                  Total: ${calculateTotal()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {calculateTotalItems()} items
                </Typography>
              </Box>

              {orderError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {orderError}
                </Alert>
              )}

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => setConfirmDialog(true)}
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={20} /> : <CartIcon />}
              >
                {submitting ? 'Processing...' : 'Submit Order'}
              </Button>

              <Button
                variant="outlined"
                fullWidth
                size="large"
                onClick={() => updateCart([])}
                sx={{ mt: 1 }}
                color="error"
              >
                Clear Cart
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>

      {/* Order Confirmation Dialog */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>Confirm Order</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to submit this order for ${calculateTotal()}?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSubmitOrder}
            variant="contained"
            disabled={submitting}
          >
            {submitting ? 'Processing...' : 'Confirm Order'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={orderSuccess} onClose={() => setOrderSuccess(false)}>
        <DialogTitle>Order Submitted Successfully!</DialogTitle>
        <DialogContent>
          <Typography>
            Your order has been submitted successfully. You will receive an email confirmation shortly.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOrderSuccess(false)} variant="contained">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CartDrawer;