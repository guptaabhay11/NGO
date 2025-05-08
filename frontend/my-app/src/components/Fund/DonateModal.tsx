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
  Alert,
  Typography,
  Box,
  Divider,
  Slider,
  IconButton,
  Paper,
  Chip,
  Stack,
  InputAdornment
} from '@mui/material';
import {
  MonetizationOn as DonateIcon,
  Favorite as HeartIcon,
  CalendarMonth as CalendarIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useDonateFundMutation } from '../../services/api';
import { Fund } from '../../types';

interface DonateModalProps {
  open: boolean;
  fund: Fund;
  onClose: () => void;
  refetchAnalytics: () => void;
  refetchFunds: () => void;
}

const intervals = ['one-time', 'monthly', 'yearly'];
const quickAmounts = [5, 10, 25, 50, 100];

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
  
  // Calculate remaining amount needed
  const remainingAmount = Math.max(0, fund.targetAmount - fund.currentAmount);
  const progressPercentage = Math.min((fund.currentAmount / fund.targetAmount) * 100, 100);
  
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
      
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error('Donation failed:', err);
      setErrorMessage(err?.data?.message || 'Donation failed. Please try again.');
    }
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: 'primary.main', 
        color: 'primary.contrastText',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <DonateIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Support {fund.name}</Typography>
        </Box>
        <IconButton 
          size="small" 
          onClick={onClose} 
          sx={{ color: 'primary.contrastText' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers sx={{ p: 3 }}>
        {/* Fund info summary */}
        <Paper elevation={0} variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Typography variant="body1" gutterBottom>
            {fund.description}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Progress: {progressPercentage.toFixed(0)}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ${fund.currentAmount} of ${fund.targetAmount}
            </Typography>
          </Box>
          
          <Box sx={{ 
            height: 10, 
            width: '100%', 
            bgcolor: 'grey.200', 
            borderRadius: 5,
            overflow: 'hidden',
            position: 'relative'
          }}>
            <Box sx={{ 
              height: '100%', 
              width: `${progressPercentage}%`, 
              bgcolor: 'success.main',
              borderRadius: 5
            }} />
          </Box>
          
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            ${remainingAmount} still needed
          </Typography>
        </Paper>

        {/* Quick amount selection */}
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, fontWeight: 'medium' }}>
          Select Amount
        </Typography>
        
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
          {quickAmounts.map((quickAmount) => (
            <Chip
              key={quickAmount}
              label={`$${quickAmount}`}
              onClick={() => setAmount(quickAmount)}
              color={amount === quickAmount ? "primary" : "default"}
              sx={{ 
                px: 1,
                '&:hover': { 
                  bgcolor: amount === quickAmount ? 'primary.main' : 'action.hover' 
                }
              }}
            />
          ))}
          <Chip
            label="Custom"
            color={!quickAmounts.includes(amount) ? "primary" : "default"}
            sx={{ 
              px: 1,
              '&:hover': { 
                bgcolor: !quickAmounts.includes(amount) ? 'primary.main' : 'action.hover' 
              }
            }}
          />
        </Stack>
        
        <TextField
          label="Donation Amount"
          type="number"
          fullWidth
          margin="normal"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          inputProps={{ min: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">$</InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
          Donation Frequency
        </Typography>
        
        <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
          {intervals.map((option) => (
            <Chip
              key={option}
              label={option === 'one-time' ? 'One-time' : option.charAt(0).toUpperCase() + option.slice(1)}
              icon={option === 'one-time' ? <DonateIcon /> : <CalendarIcon />}
              onClick={() => setInterval(option)}
              color={interval === option ? "primary" : "default"}
              variant={interval === option ? "filled" : "outlined"}
              sx={{ 
                px: 1,
                '&:hover': { 
                  bgcolor: interval === option ? 'primary.main' : 'action.hover' 
                }
              }}
            />
          ))}
        </Stack>
        
        {successMessage && (
          <Alert 
            severity="success" 
            icon={<HeartIcon />}
            sx={{ mt: 2, borderRadius: 2 }}
          >
            <Typography variant="body1">{successMessage}</Typography>
          </Alert>
        )}
        
        {errorMessage && (
          <Alert 
            severity="error" 
            sx={{ mt: 2, borderRadius: 2 }}
          >
            <Typography variant="body1">{errorMessage}</Typography>
          </Alert>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 2, bgcolor: 'grey.50' }}>
        <Button 
          onClick={onClose} 
          disabled={isLoading}
          sx={{ borderRadius: 2 }}
        >
          Cancel
        </Button>
        
        <Button
          onClick={handleDonate}
          variant="contained"
          disabled={isLoading || amount <= 0}
          endIcon={isLoading ? undefined : <HeartIcon />}
          sx={{ 
            borderRadius: 2,
            px: 3,
            py: 1
          }}
        >
          {isLoading ? <CircularProgress size={24} /> : `Donate $${amount}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DonateModal;