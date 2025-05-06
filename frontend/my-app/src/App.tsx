import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LinearProgress, CssBaseline, Container } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Dashboard } from '@mui/icons-material';
import DashboardPage from './pages/DashboardPage';

// Lazy-loaded components
const HomePage = lazy(() => import('./pages/HomePage'));
const FundsPage = lazy(() => import('./pages/FundDetailPage'));
const LoginPage = lazy(() => import('./components/Auth/Login'));


const theme = createTheme();

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Suspense fallback={<LinearProgress />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/funds" element={<FundsPage />} />
              <Route path='/login' element={<LoginPage switchToRegister={() => console.log('Switch to register')} />} />
          
            
            </Routes>
          </Suspense>

          <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/fund-details" element={<FundsPage />} />
          <Route path="/auth" element = {<LoginPage switchToRegister={() => console.log('Switch to register')} />} />
          

          </Routes>
        </Container>
   
    </ThemeProvider>
  );
};

export default App;