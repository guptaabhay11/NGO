import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Typography,
  Alert,
  Box,
  SelectChangeEvent
} from '@mui/material';
import { useDonateFundMutation } from '../../services/api';

interface Fund {
  id: string;
  name: string;
  currentAmount: number;
  targetAmount: number;
}

interface DonateModalProps {
  open: boolean;
  fund: Fund;
  onClose: () => void;
}

const DonateModal: React.FC<DonateModalProps> = ({ open, fund, onClose }) => {
  const [amount, setAmount] = useState<number>(1);
  const [interval, setInterval] = useState<string>('one-time');
  const [error, setError] = useState<string>('');
  
  const [donateFund, { isLoading }] = useDonateFundMutation();
  
  const handleIntervalChange = (e: SelectChangeEvent) => {
    setInterval(e.target.value);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    try {
      await donateFund({
        fundId: fund.id,
        amount,
        interval
      }).unwrap();
      
      onClose();
    } catch (err: any) {
      setError(err.data?.message || 'Failed to process donation. Please try again.');
    }
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Donate to {fund.name}</DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Typography variant="body2" gutterBottom>
            Fund Progress: ${fund.currentAmount} of ${fund.targetAmount}
          </Typography>
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="amount"
            label="Amount ($)"
            type="number"
            inputProps={{ min: 1 }}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="interval-label">Donation Interval</InputLabel>
            <Select
              labelId="interval-label"
              id="interval"
              value={interval}
              label="Donation Interval"
              onChange={handleIntervalChange}
            >
              <MenuItem value="one-time">One-time</MenuItem>
              <MenuItem value="monthly">Monthly ($1/month)</MenuItem>
              <MenuItem value="quarterly">Quarterly ($5/quarter)</MenuItem>
              <MenuItem value="half-yearly">Half-yearly ($10/half-year)</MenuItem>
              <MenuItem value="yearly">Yearly ($20/year)</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={isLoading || amount <= 0}
        >
          {isLoading ? 'Processing...' : 'Donate'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DonateModal;