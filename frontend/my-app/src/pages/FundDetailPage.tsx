import React, { useMemo, useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
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
  useGetFundAnalyticsQuery,
  useDeleteFundMutation,
  Fund
} from '../services/api';
import Analytics from '../components/Dashboard/Analytics';
import DonateModal from '../components/Fund/DonateModal';

const FundDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  console.log("Received ID:", id); // Debug log for id

  const navigate = useNavigate();
  const { accessToken, isAdmin } = useSelector((state: RootState) => state.auth);
  const [donateModalOpen, setDonateModalOpen] = useState(false);

  const { data: funds, isLoading, refetch: refetchFunds } = useGetAllFundsQuery();
  const [deleteFund] = useDeleteFundMutation();

 
  const fund = useMemo(() => {
    return funds?.data?.find(f => f._id === id);
  }, [funds, id]);

 
  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    error: analyticsError,
    refetch: refetchAnalytics
  } = useGetFundAnalyticsQuery({ fundId: fund?._id || '' }, { skip: !fund?._id });

  console.log("Fund details for id:", id);
  console.log("Fund:", fund);
  console.log("Analytics Data:", analyticsData);

  
  useEffect(() => {
    if (id && !fund) {
      
      refetchFunds();
    }
  }, [id, fund, refetchFunds]);

  
  if (isLoading || !fund) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8, display: 'flex', justifyContent: 'center' }}>
        {isLoading ? <CircularProgress /> : <Alert severity="error">Fund not found</Alert>}
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
          <Typography variant="h4">{fund.name}</Typography>
          <Box>
            <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mr: 1 }}>Back</Button>
            {isAdmin && (
              <Button variant="outlined" color="error" onClick={handleDelete}>Delete Fund</Button>
            )}
          </Box>
        </Box>

        <Typography paragraph>{fund.description}</Typography>

        <Box sx={{ mt: 4, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Progress: {progress.toFixed(0)}%</Typography>
            <Typography>${fund.currentAmount} of ${fund.targetAmount}</Typography>
          </Box>
          <LinearProgress value={progress} variant="determinate" sx={{ height: 10, borderRadius: 5 }} />
          {isFundClosed && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Target reached! This funding campaign is now closed.
            </Alert>
          )}
        </Box>

        {!isFundClosed && (
          <Button variant="contained" size="large" onClick={handleDonate} sx={{ mt: 2 }}>
            Donate Now
          </Button>
        )}
      </Paper>

      <Typography variant="h5" gutterBottom>Fund Analytics</Typography>
      <Divider sx={{ mb: 3 }} />
      <Analytics data={analyticsData?.data} isLoading={analyticsLoading} error={analyticsError} />

      <DonateModal
        open={donateModalOpen}
        fund={fund}
        onClose={() => setDonateModalOpen(false)}
        refetchAnalytics={refetchAnalytics}
        refetchFunds={refetchFunds}
      />
    </Container>
  );
};

export default FundDetailPage;
