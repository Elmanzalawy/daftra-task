import React, { useState } from 'react';
import {
  AppBar, Toolbar, Box, Typography, Button, IconButton, Link, Container,
  Menu, MenuItem, Divider, ListItemIcon
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import AppContext, { useAppContext } from '../context/AppContext';
import { useTheme, useMediaQuery } from '@mui/material';

const Navbar = () => {
  const [showPromo, setShowPromo] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const navigate = useNavigate();
  const { isAuthenticated } = useAppContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleProducts = () => {
    navigate('/products');
    handleMenuClose();
  };

  const handleCart = () => {
    if (isAuthenticated) {
      navigate('/cart');
    } else {
      navigate('/login');
    }
    handleMenuClose();
  };

  const handleLogin = () => {
    navigate('/login');
    handleMenuClose();
  };

  const handleSell = () => {
    // Replace with your sell page route if needed
    navigate('/sell');
    handleMenuClose();
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {showPromo && (
        <Box
          sx={{
            bgcolor: '#111',
            color: '#fff',
            px: { xs: 1, sm: 2 },
            py: 0.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            fontSize: { xs: 12, sm: 14 },
          }}
        >
          <Typography variant="body2" sx={{ flex: 1, textAlign: 'center', fontSize: { xs: 12, sm: 14 } }}>
            Sign up and get 20% off to your first order.
            <Box component="span" sx={{ fontWeight: 700, ml: 0.5 }}>
              <Link href="#" underline="none" color="inherit">
                Sign Up Now
              </Link>
            </Box>
          </Typography>
          <IconButton
            size="small"
            sx={{ color: '#fff', position: 'absolute', right: 8, top: 2 }}
            onClick={() => setShowPromo(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: '#fff',
          color: '#111',
          borderBottom: '1px solid #eee',
        }}
      >
        <Container maxWidth="lg" disableGutters>
          <Toolbar
            sx={{
              minHeight: { xs: 56, sm: 64 },
              px: { xs: 1, sm: 2 },
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: { xs: 1.5, sm: 3 },
            }}
          >
            {/* Left: Hamburger menu on mobile, logo always */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isMobile && (
                <>
                  <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleMenuOpen}
                    sx={{ mr: 1 }}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={menuOpen}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                  >
                    <MenuItem onClick={handleProducts}>
                      <ListItemIcon>
                        <Box sx={{ width: 18, height: 18, display: 'inline-block' }}>
                          {/* Optionally add icon */}
                        </Box>
                      </ListItemIcon>
                      Products
                    </MenuItem>
                    <MenuItem onClick={handleSell}>
                      <ListItemIcon>
                        <Box sx={{ width: 18, height: 18, display: 'inline-block' }}>
                          {/* Optionally add icon */}
                        </Box>
                      </ListItemIcon>
                      Sell Your Product
                    </MenuItem>
                    <MenuItem>
                      <ListItemIcon>
                        <SearchIcon fontSize="small" />
                      </ListItemIcon>
                      Search
                    </MenuItem>
                    <MenuItem onClick={handleCart}>
                      <ListItemIcon>
                        <ShoppingCartIcon fontSize="small" />
                      </ListItemIcon>
                      Cart
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogin}>
                      <ListItemIcon>
                        {/* Optionally add icon */}
                      </ListItemIcon>
                      Login
                    </MenuItem>
                  </Menu>
                </>
              )}
              <Box
                sx={{
                  border: '2px solid #111',
                  borderRadius: 1,
                  px: 1.5,
                  py: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {/* You can add your logo icon here */}
                <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: 1, fontSize: { xs: 16, sm: 18 } }}>
                  izam
                </Typography>
              </Box>
            </Box>
            {/* Center/Right: Inline nav for desktop */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  sx={{
                    color: '#111',
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: { xs: 14, sm: 16 },
                    minWidth: 0,
                    px: { xs: 1, sm: 2 },
                  }}
                  disableRipple
                  onClick={handleProducts}
                >
                  Products
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: '#111',
                    color: '#fff',
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: { xs: 13, sm: 15 },
                    borderRadius: 1.5,
                    px: { xs: 1.5, sm: 2 },
                    boxShadow: 'none',
                    '&:hover': { bgcolor: '#222' },
                    minWidth: 0,
                  }}
                  disableElevation
                  onClick={handleSell}
                >
                  Sell Your Product
                </Button>
                <IconButton sx={{ color: '#111', ml: { xs: 1, sm: 2 } }}>
                  <SearchIcon />
                </IconButton>
                <IconButton sx={{ color: '#111', ml: { xs: 1, sm: 2 } }} onClick={handleCart}>
                  <ShoppingCartIcon />
                </IconButton>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: '#111',
                    color: '#fff',
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: { xs: 13, sm: 15 },
                    borderRadius: 1.5,
                    px: { xs: 2, sm: 3 },
                    boxShadow: 'none',
                    '&:hover': { bgcolor: '#222' },
                    minWidth: 0,
                  }}
                  disableElevation
                  onClick={handleLogin}
                >
                  Login
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Navbar;
