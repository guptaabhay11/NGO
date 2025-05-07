import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Avatar,
  Stack,
  Divider
} from '@mui/material';
import { Add as AddIcon, AccountBalanceWallet as WalletIcon } from '@mui/icons-material';
import { useAddBalanceMutation } from '../../services/api'; 

interface UserWalletProps {
  userId: string;
  userName: string;
  walletBalance: number;
  refetchBalance?: () => void;
}

const UserWallet: React.FC<UserWalletProps> = ({ 
  userId, 
  userName, 
  walletBalance,
  refetchBalance 
}) => {
  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const [addBalance, { isLoading }] = useAddBalanceMutation();

  const handleAddBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (amount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    try {
      await addBalance({ userId, amount }).unwrap();
      setSuccess(true);
      setError(null);
      setAmount(0);
      
      // Refresh balance if refetch function provided
      if (refetchBalance) {
        refetchBalance();
      }

      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.data?.message || 'Failed to add balance. Please try again.');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 400, mx: 'auto' }}>
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <Avatar sx={{ bgcolor: 'primary.main' }}>
          {userName}
        </Avatar>
        <Typography variant="h6">{userName}</Typography>
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Stack direction="row" spacing={1} alignItems="center" mb={3}>
        <WalletIcon color="primary" />
        <Typography variant="h5" component="div">
          ${walletBalance.toFixed(2)}
        </Typography>
      </Stack>

      <Box component="form" onSubmit={handleAddBalance}>
        <TextField
          fullWidth
          label="Amount to Add"
          type="number"
          value={amount || ''}
          onChange={(e) => setAmount(Number(e.target.value))}
          InputProps={{ 
            inputProps: { 
              min: 0.01,
              step: 0.01 
            } 
          }}
          sx={{ mb: 2 }}
          disabled={isLoading}
          error={!!error}
          helperText={error ? '' : 'Enter amount to add to wallet'}
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
          disabled={isLoading || amount <= 0}
          type="submit"
          sx={{ mb: 2 }}
        >
          {isLoading ? 'Processing...' : 'Add Balance'}
        </Button>

        {error && (
          <Alert 
            severity="error" 
            sx={{ mt: 2 }} 
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert 
            severity="success" 
            sx={{ mt: 2 }} 
            onClose={() => setSuccess(false)}
          >
            Balance added successfully!
          </Alert>
        )}
      </Box>
    </Paper>
  );
};

export default UserWallet;