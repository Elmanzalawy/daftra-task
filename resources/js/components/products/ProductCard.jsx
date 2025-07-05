import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Box,
  TextField,
  IconButton,
  Chip,
  Skeleton,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  AddShoppingCart as AddToCartIcon
} from '@mui/icons-material';

const ProductCard = ({ product, onAddToCart, loading }) => {
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
      setError(null);
    } else if (newQuantity > product.stock) {
      setError(`Only ${product.stock} items available in stock`);
    }
  };

  const handleAddToCart = async () => {
    if (quantity > product.stock) {
      setError(`Only ${product.stock} items available in stock`);
      return;
    }

    try {
      setAdding(true);
      setError(null);
      await onAddToCart(product, quantity);
      setQuantity(1);
    } catch (err) {
      setError('Failed to add item to cart');
      console.error('Error adding to cart:', err);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Skeleton variant="rectangular" height={200} />
        <CardContent sx={{ flexGrow: 1 }}>
          <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
        </CardContent>
        <CardActions>
          <Skeleton variant="rectangular" width="100%" height={40} />
        </CardActions>
      </Card>
    );
  }

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[8]
        }
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={product.image || '/placeholder-product.jpg'}
        alt={product.name}
        sx={{ objectFit: 'cover' }}
      />
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2" noWrap>
          {product.name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {product.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
            ${product.price}
          </Typography>
          {product.category && (
            <Chip 
              label={product.category.name} 
              size="small" 
              sx={{ ml: 'auto' }}
              color="secondary"
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Stock: {product.stock}
          </Typography>
          {product.stock === 0 && (
            <Chip 
              label="Out of Stock" 
              size="small" 
              color="error"
              sx={{ ml: 'auto' }}
            />
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 1, mb: 1 }} variant="outlined">
            {error}
          </Alert>
        )}
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
          {/* Quantity Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              size="small"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || product.stock === 0}
            >
              <RemoveIcon />
            </IconButton>
            
            <TextField
              size="small"
              value={quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 1;
                handleQuantityChange(value);
              }}
              inputProps={{ 
                min: 1, 
                max: product.stock,
                style: { textAlign: 'center', width: '60px' }
              }}
              disabled={product.stock === 0}
            />
            
            <IconButton
              size="small"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= product.stock || product.stock === 0}
            >
              <AddIcon />
            </IconButton>
          </Box>

          {/* Add to Cart Button */}
          <Button
            variant="contained"
            startIcon={<AddToCartIcon />}
            onClick={handleAddToCart}
            disabled={product.stock === 0 || adding}
            sx={{ ml: 'auto' }}
            size="small"
          >
            {adding ? 'Adding...' : 'Add to Cart'}
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
};

export default ProductCard;