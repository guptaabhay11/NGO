import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LinearProgress, CssBaseline, Container } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Lazy-loaded components
const HomePage = lazy(() => import('./pages/HomePage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const FundDetails = lazy(() => import('./pages/FundDetailPage'));
const LoginPage = lazy(() => import('./components/Auth/Login'));
const FundsPage = lazy(() => import('./pages/FundDetailPage'));

const theme = createTheme();

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Suspense fallback={<LinearProgress />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage switchToRegister={() => {}} />} />
            <Route path="/funds" element={<FundsPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/auth" element={<LoginPage switchToRegister={() => {}} />} />
            <Route path="/fund-details" element={<FundDetails />} />
            <Route path="/fund/:id" element={<FundDetails />} />
          </Routes>
        </Suspense>
      </Container>
    </ThemeProvider>
  );
};

export default App;
