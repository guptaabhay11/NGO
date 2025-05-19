import React, { useEffect } from 'react';
import { Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import DashboardComponent from '../components/Dashboard/DashboardPage';

const DashboardPage: React.FC = () => {


  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 8 }}>
      <DashboardComponent />
    </Container>
  );
};

export default DashboardPage;