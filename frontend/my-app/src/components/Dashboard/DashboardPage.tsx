import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Paper,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CircularProgress,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useCreateFundMutation, useGetRecentDonationsQuery } from '../../services/api';
import FundsList from '../Fund/FundsList';
import UserWallet from './UserWallet'
import { useNavigate } from 'react-router-dom';
const DashboardPage: React.FC = () => {
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role === 'ADMIN';
  const navigate = useNavigate();
  const { data: recentDonations, isLoading: loadingDonations } = useGetRecentDonationsQuery();

  const [createFundOpen, setCreateFundOpen] = useState(false);
  const [fundName, setFundName] = useState('');
  const [fundDescription, setFundDescription] = useState('');
  const [fundTarget, setFundTarget] = useState<number>(1000);
  const [fundPlan, setFundPlan] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const plans = ['monthly', 'quarterly', 'half-yearly', 'yearly'];

  const [createFund, { isLoading: creatingFund }] = useCreateFundMutation();

  const handleCreateFund = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fundName || !fundDescription || fundTarget <= 0 || !fundPlan) {
      setError('Please fill all fields with valid values');
      return;
    }

    try {
      await createFund({
        name: fundName,
        description: fundDescription,
        targetAmount: fundTarget,
        plan: fundPlan,
      }).unwrap();

      setCreateFundOpen(false);
      setFundName('');
      setFundDescription('');
      setFundTarget(1000);
      setFundPlan('');
      setSuccess('Fund successfully created!');
    } catch (err: any) {
      console.error('Create fund error:', err);
      const message = err?.data?.message || err?.error || 'Failed to create fund. Please try again.';
      setError(message);
    }
  };

  
  if (loading || !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard
          </Typography>
  
          <Box sx={{ display: 'flex', gap: 2 }}>
            {isAdmin && (
              <Button variant="contained" onClick={() => setCreateFundOpen(true)}>
                Create New Fund
              </Button>
            )}
            <Button variant="outlined" onClick={() => navigate('/wallet')}>
              User Wallet
            </Button>
          </Box>
        </Box>
  
        <Typography variant="h6" gutterBottom>
          Welcome, {user.name || 'User'}!
        </Typography>
      </Paper>
  
      <Typography variant="h5" sx={{ mb: 2 }}>
        Active Funds
      </Typography>
      <FundsList />
  
      {/* Dialog for creating a new fund */}
      <Dialog open={createFundOpen} onClose={() => setCreateFundOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Fund</DialogTitle>
  
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
  
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Fund Name"
              value={fundName}
              onChange={(e) => setFundName(e.target.value)}
            />
  
            <TextField
              margin="normal"
              required
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={fundDescription}
              onChange={(e) => setFundDescription(e.target.value)}
            />
  
            <TextField
              margin="normal"
              required
              fullWidth
              label="Target Amount ($)"
              type="number"
              inputProps={{ min: 1 }}
              value={fundTarget}
              onChange={(e) => setFundTarget(Number(e.target.value))}
            />
  
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="plan-label">Plan</InputLabel>
              <Select
                labelId="plan-label"
                value={fundPlan}
                label="Plan"
                onChange={(e) => setFundPlan(e.target.value)}
              >
                {plans.map((plan) => (
                  <MenuItem key={plan} value={plan}>
                    {plan}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
  
        <DialogActions>
          <Button onClick={() => setCreateFundOpen(false)} disabled={creatingFund}>
            Cancel
          </Button>
          <Button onClick={handleCreateFund} variant="contained" disabled={creatingFund}>
            {creatingFund ? 'Creating...' : 'Create Fund'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
  
export default DashboardPage;
