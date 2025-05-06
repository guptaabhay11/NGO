import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Alert 
} from '@mui/material';
import { useLoginMutation } from '../../services/api';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/reducers/authReducer';
import { useNavigate } from 'react-router-dom'; // ✅ Import this

interface LoginProps {
  switchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ switchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ Initialize

  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await login({ email, password }).unwrap();
      const { user } = response.data;

      dispatch(setUser(user));

      // ✅ Redirect after successful login
      navigate('/dashboard'); // Change route as needed

    } catch (err: any) {
      console.error(err);
      setError(err?.data?.message || 'Login failed');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Typography component="h1" variant="h5" align="center" gutterBottom>
        Login
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isLoading}
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>

      <Box textAlign="center">
        <Typography variant="body2">
          Don't have an account?{' '}
          <Button 
            variant="text" 
            onClick={switchToRegister}
            sx={{ p: 0, verticalAlign: 'baseline', textTransform: 'none' }}
          >
            Register
          </Button>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
