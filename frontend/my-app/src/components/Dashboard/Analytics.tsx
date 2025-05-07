import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Divider,
  useTheme,
  Stack,
  Chip
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleIcon from '@mui/icons-material/People';
import CalculateIcon from '@mui/icons-material/Calculate';

interface Donation {
  _id: string;
  donatedBy: { name: string };
  plan: { amount: number; interval: string };
  createdAt: string;
}

interface AnalyticsData {
  currentAmount: number;
  targetAmount: number;
  recentDonations: Donation[];
  donations: { length: number };
}

interface AnalyticsProps {
  data?: AnalyticsData;
  isLoading: boolean;
  error: any;
}

const Analytics: React.FC<AnalyticsProps> = ({ data, isLoading, error }) => {
  const theme = useTheme();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
        {error ? (error as any)?.data?.message || 'Failed to load analytics data' : 'No data available'}
      </Alert>
    );
  }

  const { currentAmount, targetAmount, donations, recentDonations } = data;
  const totalDonors = donations?.length || 0;
  const progress = targetAmount ? Math.min(100, (currentAmount / targetAmount) * 100) : 0;
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Donation Analytics
      </Typography>
      
      {/* Summary Cards */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 3 }}>
        <Card elevation={3} sx={{ 
          flex: 1, 
          bgcolor: theme.palette.primary.light, 
          color: theme.palette.primary.contrastText 
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AttachMoneyIcon sx={{ mr: 1, fontSize: 28 }} />
              <Typography variant="h6">Total Donations</Typography>
            </Box>
            <Typography variant="h3" fontWeight="bold">
              {formatCurrency(currentAmount)}
            </Typography>
            {targetAmount && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {progress.toFixed(1)}% of {formatCurrency(targetAmount)} goal
              </Typography>
            )}
          </CardContent>
        </Card>
        
        <Card elevation={3} sx={{ flex: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PeopleIcon sx={{ mr: 1, fontSize: 28 }} />
              <Typography variant="h6">Total Donors</Typography>
            </Box>
            <Typography variant="h3" fontWeight="bold">
              {totalDonors}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Unique contributors
            </Typography>
          </CardContent>
        </Card>
        
        <Card elevation={3} sx={{ flex: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalculateIcon sx={{ mr: 1, fontSize: 28 }} />
              <Typography variant="h6">Average Donation</Typography>
            </Box>
            <Typography variant="h3" fontWeight="bold">
              {totalDonors > 0 ? formatCurrency(currentAmount / totalDonors) : '$0.00'}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Per donor
            </Typography>
          </CardContent>
        </Card>
      </Stack>
      
      {/* Recent Donations */}
      <Box>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              Recent Donations
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {recentDonations.length > 0 ? (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: theme.palette.action.hover }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Donor</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Interval</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentDonations.map((donation) => (
                      <TableRow key={donation._id} hover>
                        <TableCell>{donation.donatedBy?.name || 'Anonymous'}</TableCell>
                        <TableCell>{formatCurrency(donation.plan.amount)}</TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={donation.plan.interval}
                            color={donation.plan.interval === 'monthly' ? 'primary' : 'default'}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{new Date(donation.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No recent donations
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Analytics;