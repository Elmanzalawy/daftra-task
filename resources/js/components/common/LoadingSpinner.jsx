import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Backdrop,
  Container
} from '@mui/material';

const LoadingSpinner = ({ 
  message = 'Loading...', 
  backdrop = false, 
  size = 40,
  fullPage = false 
}) => {
  const LoadingContent = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        ...(fullPage && {
          minHeight: '50vh'
        })
      }}
    >
      <CircularProgress size={size} />
      {message && (
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );

  if (backdrop) {
    return (
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: 'column',
          gap: 2
        }}
        open={true}
      >
        <CircularProgress color="inherit" size={size} />
        {message && (
          <Typography variant="body1" color="inherit">
            {message}
          </Typography>
        )}
      </Backdrop>
    );
  }

  if (fullPage) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LoadingContent />
      </Container>
    );
  }

  return <LoadingContent />;
};

export default LoadingSpinner;