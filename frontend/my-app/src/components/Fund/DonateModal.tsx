import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import { useDonateFundMutation, Fund } from '../../services/api';

interface DonateModalProps {
  open: boolean;
  fund: Fund;
  onClose: () => void;
  refetchAnalytics: () => void;
  refetchFunds: () => void;
}

const intervals = ['one-time', 'monthly', 'yearly'];

const DonateModal: React.FC<DonateModalProps> = ({
  open,
  fund,
  onClose,
  refetchAnalytics,
  refetchFunds
}) => {
  const [amount, setAmount] = useState<number>(10);
  const [interval, setInterval] = useState<string>('one-time');
  const [donateFund, { isLoading }] = useDonateFundMutation();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setErrorMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const handleDonate = async () => {
    try {
      await donateFund({
        fundId: fund._id,
        amount,
        interval
      }).unwrap();

      refetchAnalytics();
      refetchFunds();
      setSuccessMessage('Donation successful! Thank you.');
      setAmount(10);
      setInterval('one-time');

      // Delay modal close slightly to show message
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error('Donation failed:', err);
      setErrorMessage(err?.data?.message || 'Donation failed. Please try again.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Donate to {fund.name}</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Amount"
          type="number"
          fullWidth
          margin="normal"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          inputProps={{ min: 1 }}
        />

        <TextField
          label="Donation Interval"
          select
          fullWidth
          margin="normal"
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
        >
          {intervals.map((option) => (
            <MenuItem key={option} value={option}>
              {option === 'one-time' ? 'One-time' : option.charAt(0).toUpperCase() + option.slice(1)}
            </MenuItem>
          ))}
        </TextField>

        {successMessage && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {successMessage}
          </Alert>
        )}

        {errorMessage && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleDonate}
          variant="contained"
          disabled={isLoading || amount <= 0}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Donate'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DonateModal;
