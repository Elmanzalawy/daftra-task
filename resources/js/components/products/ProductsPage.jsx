import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Paper,
  Pagination,
  Fab,
  Badge,
  Drawer,
  InputAdornment,
  Chip,
  Alert,
  Button,
  IconButton,
  Divider,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useMediaQuery
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  ShoppingCart as CartIcon,
  Clear as ClearIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import AppContext from '../../context/AppContext';
import { apiService } from '../../services/apiService';
import ProductCard from './ProductCard';
import CartDrawer from './CartDrawer';
import LoadingSpinner from '../common/LoadingSpinner';

// --- Product Details Drawer Component ---
const ProductDetailsDrawer = ({ open, onClose, product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
  }, [product]);

  if (!product) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 400 }, maxWidth: '100vw' }
      }}
    >
      <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Product Details</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>
        <Box sx={{ mb: 2, textAlign: 'center' }}>
            <img
                src={product.image}
                alt={product.name}
                style={{
                    width: '100%',
                    // maxWidth: 220,
                    // maxHeight: 180,
                    // objectFit: 'contain',
                    borderRadius: 8,
                    margin: '0 auto',
                    display: 'block'
                }}
            />
        </Box>
        <Typography variant="subtitle1" fontWeight={600}>{product.name}</Typography>
        <Chip label={product.category?.name || ''} size="small" sx={{ ml: 1, mb: 1 }} />
        <Typography variant="h5" sx={{ mb: 1 }}>${product.price}</Typography>
        <Divider sx={{ my: 1 }} />
        <Typography variant="subtitle2" fontWeight={600}>Product Details</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography color="text.secondary" fontSize={14}>Category:</Typography>
          <Typography fontSize={14}>{product.category?.name || ''}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography color="text.secondary" fontSize={14}>Stock:</Typography>
          <Typography fontSize={14}>{product.stock} Items</Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Quantity</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Button variant="outlined" size="small" onClick={() => setQuantity(q => Math.max(1, q - 1))} sx={{ minWidth: 32 }}>-</Button>
          <Typography sx={{ mx: 2 }}>{quantity}</Typography>
          <Button variant="outlined" size="small" onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} sx={{ minWidth: 32 }}>+</Button>
        </Box>
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 'auto', py: 1.2, fontWeight: 600, fontSize: 16, borderRadius: 1 }}
          onClick={() => { onAddToCart(product, quantity); onClose(); }}
        >
          Add to Cart
        </Button>
      </Box>
    </Drawer>
  );
};

const ProductsPage = () => {
  const { user, cart, updateCart } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const isMobile = useMediaQuery('(max-width:600px)');

  // Fetch products based on filters
  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        search: searchTerm,
        categories: selectedCategories,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        per_page: 8
      };

      const response = await apiService.get('/products', { params });
      setProducts(response.data.data);
      setTotalPages(response.data.last_page);
      setCurrentPage(response.data.current_page);
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await apiService.get('/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(1);
    // eslint-disable-next-line
  }, [searchTerm, selectedCategories, priceRange]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    fetchProducts(value);
  };

  const handleAddToCart = (product, quantity) => {
    updateCart(product.id, quantity);
  };

  const getTotalCartItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setPriceRange([0, 1000]);
  };

  // --- Filter Drawer ---
  const FilterDrawer = (
    <Drawer
      anchor="left"
      open={filtersOpen}
      onClose={() => setFiltersOpen(false)}
      PaperProps={{ sx: { width: { xs: '100%', sm: 320 }, maxWidth: '100vw', p: 2 } }}
    >
      <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Filters</Typography>
          <Button size="small" onClick={clearFilters} sx={{ textTransform: 'none', color: 'text.secondary' }}>Clear all filters</Button>
          <IconButton onClick={() => setFiltersOpen(false)}><CloseIcon /></IconButton>
        </Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Price</Typography>
          <Slider
            value={priceRange}
            onChange={(e, newValue) => setPriceRange(newValue)}
            valueLabelDisplay="auto"
            min={0}
            max={300}
            step={5}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </Box>
        </Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Category</Typography>
          <List dense>
            <ListItem disablePadding>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Checkbox
                  checked={selectedCategories.length === 0}
                  onChange={() => setSelectedCategories([])}
                  size="small"
                />
              </ListItemIcon>
              <ListItemText primary="All" />
            </ListItem>
            {categories.map((category) => (
              <ListItem key={category.id} disablePadding>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Checkbox
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => {
                      if (selectedCategories.includes(category.id)) {
                        setSelectedCategories(selectedCategories.filter(id => id !== category.id));
                      } else {
                        setSelectedCategories([...selectedCategories.filter(id => id), category.id]);
                      }
                    }}
                    size="small"
                  />
                </ListItemIcon>
                <ListItemText primary={category.name} />
              </ListItem>
            ))}
          </List>
        </Box>
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 'auto', py: 1.2, fontWeight: 600, fontSize: 16, borderRadius: 1 }}
          onClick={() => { setFiltersOpen(false); fetchProducts(1); }}
        >
          Apply Filter
        </Button>
        <Button
          fullWidth
          sx={{ mt: 1, color: 'text.secondary', textTransform: 'none' }}
          onClick={clearFilters}
        >
          Clear all filters
        </Button>
      </Box>
    </Drawer>
  );

  // --- Top Bar ---
  const TopBar = (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      mb: 2,
      gap: 2,
      flexWrap: 'wrap',
      justifyContent: 'space-between'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
        <IconButton
          sx={{ display: { xs: 'inline-flex', md: 'none' }, mr: 1 }}
          onClick={() => setFiltersOpen(true)}
        >
          <FilterIcon />
        </IconButton>
        <TextField
          fullWidth
          placeholder="Search by product name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: { borderRadius: 2, background: '#fff' }
          }}
          sx={{ maxWidth: 400 }}
        />
      </Box>
      <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          onClick={() => setFiltersOpen(true)}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 500 }}
        >
          Filters
        </Button>
      </Box>
    </Box>
  );

  if (loading && products.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <Box sx={{ bgcolor: '#181818', minHeight: '100vh', py: { xs: 0, md: 4 } }}>
      {/* Filter Drawer */}
      {FilterDrawer}

      {/* Product Details Drawer */}
      <ProductDetailsDrawer
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        product={selectedProduct}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        updateCart={updateCart}
      />

      <Container maxWidth="xl" sx={{
        bgcolor: '#fff',
        borderRadius: { xs: 0, md: 2 },
        boxShadow: { xs: 'none', md: 4 },
        py: { xs: 0, md: 3 },
        px: { xs: 0, md: 3 },
        minHeight: '90vh'
      }}>
        {/* Top Bar */}
        {TopBar}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Products Grid */}
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>Casual</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Showing {products.length > 0 ? `1-${products.length}` : 0} of {products.length} Products
        </Typography>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={6} sm={6} md={4} key={product.id}>
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
                loading={loading}
                onClick={() => {
                  setSelectedProduct(product);
                  setDetailsOpen(true);
                }}
                showCategoryChip
                showStock
                showQuantityInput
              />
            </Grid>
          ))}
        </Grid>

        {products.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No products found matching your criteria
            </Typography>
          </Box>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </Box>
        )}
      </Container>

      {/* Floating Cart Button */}
      <Fab
        color="primary"
        aria-label="cart"
        sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1201 }}
        onClick={() => setCartOpen(true)}
      >
        <Badge badgeContent={getTotalCartItems()} color="secondary">
          <CartIcon />
        </Badge>
      </Fab>
      {/* Floating Filter Button for mobile */}
      <Fab
        color="default"
        aria-label="filter"
        sx={{
          position: 'fixed',
          bottom: 88,
          right: 16,
          zIndex: 1201,
          display: { xs: 'flex', md: 'none' }
        }}
        onClick={() => setFiltersOpen(true)}
      >
        <FilterIcon />
      </Fab>
    </Box>
  );
};

export default ProductsPage;