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
  CircularProgress,
  Card,
  CardContent,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  Fade,
  Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import FlagIcon from '@mui/icons-material/Flag';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const navigate = useNavigate();
  const { accessToken, isAdmin } = useSelector((state: RootState) => state.auth);
  const [donateModalOpen, setDonateModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  useEffect(() => {
    if (id && !fund) {
      refetchFunds();
    }
  }, [id, fund, refetchFunds]);

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Box textAlign="center">
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
            Loading fund details...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!fund) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Alert 
          severity="error" 
          variant="filled"
          sx={{ 
            maxWidth: 500, 
            width: '100%',
            py: 2
          }}
        >
          <Typography variant="h6" gutterBottom>Fund Not Found</Typography>
          <Typography>The fundraiser you're looking for is no longer available or has been completed.</Typography>
          <Button 
            variant="contained" 
            color="inherit" 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate(-1)}
            sx={{ mt: 2 }}
          >
            Return to Funds
          </Button>
        </Alert>
      </Container>
    );
  }

  const progress = Math.min((fund.currentAmount / fund.targetAmount) * 100, 100);
  const isFundClosed = progress >= 100;
  const remainingAmount = Math.max(0, fund.targetAmount - fund.currentAmount);

  const handleDonate = () => {
    if (!accessToken) {
      navigate('/auth');
      return;
    }

    if (isFundClosed) {
      setErrorMessage("This funding campaign has already reached its target and is now closed.");
      setDonateModalOpen(false);
      setTimeout(() => navigate(-1), 3000);
      return;
    }

    setDonateModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteFund({ fundId: fund.id }).unwrap();
      navigate('/');
    } catch (err) {
      console.error('Failed to delete fund:', err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 4 }, mb: 8 }}>
      {/* Header with back button */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} color="primary" sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" color="text.secondary">Back to Funds</Typography>
      </Box>
      
      {/* Main fund details card with gradient header */}
      <Paper 
        elevation={3} 
        sx={{ 
          mb: 4, 
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        {/* Colored header bar */}
        <Box 
          sx={{ 
            height: '12px', 
            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)` 
          }} 
        />
        
        <Box sx={{ p: { xs: 2, sm: 4 } }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start', 
            mb: 3,
            flexDirection: isMobile ? 'column' : 'row'
          }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {fund.name}
              </Typography>
              <Chip 
                label={fund.isActive ? "Active" : "Inactive"} 
                color={fund.isActive ? "success" : "default"}
                size="small"
                sx={{ mb: 1 }}
              />
            </Box>
            
            {isAdmin && (
              <Button 
                variant="outlined" 
                color="error" 
                startIcon={<DeleteOutlineIcon />} 
                onClick={() => setShowDeleteConfirm(true)}
                sx={{ mt: isMobile ? 2 : 0 }}
              >
                Delete Fund
              </Button>
            )}
          </Box>

          <Typography 
            variant="body1" 
            paragraph 
            sx={{ 
              fontSize: '1.1rem',
              lineHeight: 1.7,
              color: 'text.secondary',
              mb: 4
            }}
          >
            {fund.description}
          </Typography>

          {/* Fund key metrics using Box layout instead of Grid */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row', 
              gap: 3, 
              mb: 4
            }}
          >
            {/* Financial Details Card */}
            <Card variant="outlined" sx={{ flex: 1, mb: isMobile ? 2 : 0 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MonetizationOnIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Financial Details</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Current funding status
                </Typography>
                
                <Box sx={{ mt: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Target</Typography>
                    <Typography variant="body1" fontWeight="medium">${fund.targetAmount.toLocaleString()}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Raised</Typography>
                    <Typography variant="body1" fontWeight="medium" color="primary">${fund.currentAmount.toLocaleString()}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Remaining</Typography>
                    <Typography variant="body1" fontWeight="medium">${remainingAmount.toLocaleString()}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
            
            {/* Fund Details Card */}
            <Card variant="outlined" sx={{ flex: 1 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FlagIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Fund Details</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Additional information
                </Typography>
                
                <Box sx={{ mt: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Plan</Typography>
                    <Typography variant="body1" fontWeight="medium">{fund.plan}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Status</Typography>
                    <Typography 
                      variant="body1" 
                      fontWeight="medium" 
                      color={isFundClosed ? "success.main" : "info.main"}
                    >
                      {isFundClosed ? "Target Reached" : "In Progress"}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Progress bar section */}
          <Box sx={{ mt: 4, mb: 3, px: { sm: 2 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" fontWeight="medium">
                Funding Progress: {progress.toFixed(0)}%
              </Typography>
              <Typography variant="body2">
                ${fund.currentAmount.toLocaleString()} of ${fund.targetAmount.toLocaleString()}
              </Typography>
            </Box>
            <LinearProgress 
              value={progress} 
              variant="determinate" 
              sx={{ 
                height: 12, 
                borderRadius: 6,
                backgroundColor: theme.palette.grey[200],
                '& .MuiLinearProgress-bar': {
                  backgroundColor: isFundClosed 
                    ? theme.palette.success.main 
                    : progress > 70 
                      ? theme.palette.info.main 
                      : theme.palette.primary.main
                }
              }} 
            />
            
            {isFundClosed && (
              <Alert 
                icon={<VolunteerActivismIcon fontSize="inherit" />}
                severity="success" 
                sx={{ mt: 2 }}
              >
                Target reached! This funding campaign is now closed. Thank you to all contributors.
              </Alert>
            )}
          </Box>

          {/* Donate button */}
          {!isFundClosed && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button 
                variant="contained" 
                size="large" 
                onClick={handleDonate} 
                startIcon={<VolunteerActivismIcon />}
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 'bold'
                }}
              >
                Donate Now
              </Button>
            </Box>
          )}
          
          {errorMessage && (
            <Alert severity="info" sx={{ mt: 3 }}>
              {errorMessage}
            </Alert>
          )}
          
          {/* Delete confirmation */}
          {showDeleteConfirm && (
            <Fade in={showDeleteConfirm}>
              <Alert 
                severity="warning" 
                sx={{ mt: 3 }}
                action={
                  <Box>
                    <Button 
                      color="inherit" 
                      size="small" 
                      onClick={() => setShowDeleteConfirm(false)}
                      sx={{ mr: 1 }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      color="error" 
                      size="small" 
                      variant="contained"
                      onClick={handleDelete}
                    >
                      Delete
                    </Button>
                  </Box>
                }
              >
                <Typography variant="subtitle2">Are you sure you want to delete this fund?</Typography>
                <Typography variant="body2">This action cannot be undone.</Typography>
              </Alert>
            </Fade>
          )}
        </Box>
      </Paper>

      {/* Analytics section */}
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <CalendarTodayIcon sx={{ mr: 1 }} /> 
          Fund Analytics
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        {analyticsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : analyticsError ? (
          <Alert severity="error" sx={{ my: 2 }}>
            Unable to load analytics data. Please try again later.
          </Alert>
        ) : (
          <Analytics data={analyticsData?.data} isLoading={analyticsLoading} error={analyticsError} />
        )}
      </Paper>

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