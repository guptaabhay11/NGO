import React, { useEffect } from 'react';
import { Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import DashboardComponent from '../components/Dashboard/DashboardPage';

const DashboardPage: React.FC = () => {
  const accessToken = localStorage.getItem('access_token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      navigate('/auth');
    }
  }, [accessToken, navigate]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <DashboardComponent />
    </Container>
  );
};

export default DashboardPage;