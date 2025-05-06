import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box component="footer" sx={{ 
      bgcolor: '#f5f5f5', 
      py: 3, 
      mt: 'auto',
      width: '100%',
      position: 'relative',
      bottom: 0
    }}>
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} NGO Crowdfunding Platform. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;