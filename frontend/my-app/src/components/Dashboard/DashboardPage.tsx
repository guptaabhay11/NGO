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
  CircularProgress,
  Alert,
  Divider,
  Paper
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useCreateFundMutation, useGetRecentDonationsQuery } from '../../services/api';
import FundsList from '../Fund/FundsList';

const DashboardPage: React.FC = () => {
  const { user, isAdmin } = useSelector((state: RootState) => state.auth);
  const { data: recentDonations, isLoading: loadingDonations } = useGetRecentDonationsQuery();
  
  const [createFundOpen, setCreateFundOpen] = useState(false);
  const [fundName, setFundName] = useState('');
  const [fundDescription, setFundDescription] = useState('');
  const [fundTarget, setFundTarget] = useState<number>(1000);
  const [error, setError] = useState('');
  
  const [createFund, { isLoading: creatingFund }] = useCreateFundMutation();

  const handleCreateFund = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!fundName || !fundDescription || fundTarget <= 0) {
      setError('Please fill all fields with valid values');
      return;
    }
    
    try {
      await createFund({
        name: fundName,
        description: fundDescription,
        targetAmount: fundTarget
      }).unwrap();
      
      setCreateFundOpen(false);
      setFundName('');
      setFundDescription('');
      setFundTarget(1000);
    } catch (err: any) {
      setError(err.data?.message || 'Failed to create fund. Please try again.');
    }
  };

  return (
    <Box sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard
          </Typography>
          
          {isAdmin && (
            <Button 
              variant="contained" 
              onClick={() => setCreateFundOpen(true)}
            >
              Create New Fund
            </Button>
          )}
        </Box>
        
        <Typography variant="h6" gutterBottom>
          Welcome, {user?.name || 'User'}!
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
          
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="fundName"
              label="Fund Name"
              name="fundName"
              autoFocus
              value={fundName}
              onChange={(e) => setFundName(e.target.value)}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="fundDescription"
              label="Description"
              name="fundDescription"
              multiline
              rows={4}
              value={fundDescription}
              onChange={(e) => setFundDescription(e.target.value)}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="fundTarget"
              label="Target Amount ($)"
              name="fundTarget"
              type="number"
              inputProps={{ min: 1 }}
              value={fundTarget}
              onChange={(e) => setFundTarget(Number(e.target.value))}
            />
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setCreateFundOpen(false)} disabled={creatingFund}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateFund} 
            variant="contained" 
            disabled={creatingFund}
          >
            {creatingFund ? 'Creating...' : 'Create Fund'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardPage;