import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LinearProgress, CssBaseline, Container } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ProtectedLayout from './components/layouts/Authanticated';
import UserWallet from './components/Dashboard/UserWallet';
import AppInitializer from './components/layouts/AppInitializer';
// Lazy-loaded components
const HomePage = lazy(() => import('./pages/HomePage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const FundDetails = lazy(() => import('./pages/FundDetailPage'));
const LoginPage = lazy(() => import('./components/Auth/Login'));
const FundsPage = lazy(() => import('./pages/FundDetailPage'));
const RegisterPage = lazy(() => import('./components/Auth/Register'));


const theme = createTheme();

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppInitializer/>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Suspense fallback={<LinearProgress />}>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage switchToRegister={() => {}} />} />
    <Route path="/auth" element={<LoginPage switchToRegister={() => {}} />} />
    <Route path="/register" element={<RegisterPage switchToLogin={() => {}} />} />
    <Route path="/wallet" element={<UserWallet />} />


    {/* Protected Routes */}
    <Route element={<ProtectedLayout />}>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/funds" element={<FundsPage />} />
      <Route path="/fund/:id" element={<FundDetails />} />
    </Route>
  </Routes>
</Suspense>
      </Container>
    </ThemeProvider>
  );
};

export default App;
