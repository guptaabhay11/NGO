import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Grid, 
  LinearProgress,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { 
  useGetAllFundsQuery, 
  Fund, 
  useDeleteFundMutation 
} from '../services/api';
import Analytics from '../components/Dashboard/Analytics';
import DonateModal from '../components/Fund/DonateModal';

const FundDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: funds, isLoading } = useGetAllFundsQuery();
  const [deleteFund] = useDeleteFundMutation();
  const { accessToken, isAdmin } = useSelector((state: RootState) => state.auth);
  
  const [donateModalOpen, setDonateModalOpen] = useState(false);
  
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }
  
  const fund = funds?.find(f => f.id === id);
  
  if (!fund) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Alert severity="error">Fund not found</Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/')} 
          sx={{ mt: 2 }}
        >
          Back to Home
        </Button>
      </Container>
    );
  }
  
  const progress = Math.min((fund.currentAmount / fund.targetAmount) * 100, 100);
  const isFundClosed = progress >= 100;
  
  const handleDonate = () => {
    if (!accessToken) {
      navigate('/auth');
      return;
    }
    setDonateModalOpen(true);
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this fund?')) {
      try {
        await deleteFund({ fundId: fund.id }).unwrap();
        navigate('/');
      } catch (err) {
        console.error('Failed to delete fund:', err);
      }
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Typography variant="h4" component="h1">
            {fund.name}
          </Typography>
          
          <Box>
            <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mr: 1 }}>
              Back
            </Button>
            
            {isAdmin && (
              <Button variant="outlined" color="error" onClick={handleDelete}>
                Delete Fund
              </Button>
            )}
          </Box>
        </Box>
        
        <Typography variant="body1" paragraph>
          {fund.description}
        </Typography>
        
        <Box sx={{ mt: 4, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body1">
              Progress: {progress.toFixed(0)}%
            </Typography>
            <Typography variant="body1">
              ${fund.currentAmount} of ${fund.targetAmount}
            </Typography>
          </Box>
          
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            color={isFundClosed ? "success" : "primary"}
            sx={{ height: 10, borderRadius: 5 }}
          />
          
          {isFundClosed && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Target reached! This funding campaign is now closed.
            </Alert>
          )}
        </Box>
        
        {!isFundClosed && (
          <Button 
            variant="contained" 
            size="large" 
            onClick={handleDonate}
            sx={{ mt: 2 }}
          >
            Donate Now
          </Button>
        )}
      </Paper>
      
      <Typography variant="h5" gutterBottom>
        Fund Analytics
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Analytics fundId={fund.id} />
      
      {/* Donate Modal */}
      <DonateModal
        open={donateModalOpen}
        fund={fund}
        onClose={() => setDonateModalOpen(false)}
      />
    </Container>
  );
};

export default FundDetailPage;