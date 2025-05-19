import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  Typography,
  Box,
  Divider,
  IconButton,
  Paper,
  Chip,
  Stack
} from '@mui/material';
import {
  MonetizationOn as DonateIcon,
  Favorite as HeartIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useCreateSessionMutation, useMeQuery } from '../../services/api';
import { Fund } from '../../types';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface DonateModalProps {
  open: boolean;
  fund: Fund;
  onClose: () => void;
  refetchAnalytics: () => void;
  refetchFunds: () => void;
}

const subscriptionPlans = [
  { id: 'monthly', label: 'Monthly', price: 1, priceId: 'price_1RMUCdGa98Tin9whugMtfBLM' },
  { id: 'quarterly', label: 'Quarterly', price: 5, priceId: 'price_1RMUCdGa98Tin9whsY4TbAAF' },
  { id: 'half-yearly', label: 'Half Yearly', price: 10, priceId: 'price_1RMUCdGa98Tin9whcUWtMXCj' },
  { id: 'yearly', label: 'Yearly', price: 20, priceId: 'price_1RMUCdGa98Tin9whRLrwVSwc' },
];

const DonateModal: React.FC<DonateModalProps> = ({
  open,
  fund,
  onClose,
  refetchAnalytics,
  refetchFunds
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: currentUser } = useMeQuery();
  console.log("user from root", user);
  console.log("curr", currentUser);

  const [selectedPlan, setSelectedPlan] = useState<string>('monthly');
  const [createSession, { isLoading }] = useCreateSessionMutation();
  
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
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
      if (!user?.id && !currentUser?.id) {
        throw new Error('Please log in to make a donation');
      }

      const userId = user?.id || currentUser?.id;
      const selectedPlanData = subscriptionPlans.find(plan => plan.id === selectedPlan);
      if (!selectedPlanData) {
        throw new Error('Selected plan not found');
      }

      const response = await createSession({
        userId: userId as string,
        priceId: selectedPlanData.priceId,
        fundId: fund._id,
        interval: selectedPlan
      }).unwrap();
      
      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: any) {
      console.error('Checkout failed:', err);
      setErrorMessage(err?.data?.message || err.message || 'Checkout failed. Please try again.');
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

        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
          Select Subscription Plan
        </Typography>
        
        <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
          {subscriptionPlans.map((plan) => (
            <Chip
              key={plan.id}
              label={`${plan.label} ($${plan.price})`}
              onClick={() => setSelectedPlan(plan.id)}
              color={selectedPlan === plan.id ? "primary" : "default"}
              variant={selectedPlan === plan.id ? "filled" : "outlined"}
              sx={{ 
                px: 1,
                '&:hover': { 
                  bgcolor: selectedPlan === plan.id ? 'primary.main' : 'action.hover' 
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
          disabled={isLoading}
          endIcon={isLoading ? undefined : <HeartIcon />}
          sx={{ 
            borderRadius: 2,
            px: 3,
            py: 1
          }}
        >
          {isLoading ? <CircularProgress size={24} /> : `Subscribe ($${subscriptionPlans.find(p => p.id === selectedPlan)?.price})`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DonateModal;