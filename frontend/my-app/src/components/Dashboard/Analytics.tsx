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
  Alert
} from '@mui/material';

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
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error ? (error as any)?.data?.message || 'Failed to load analytics data' : 'No data available'}
      </Alert>
    );
  }

  const { currentAmount, donations, recentDonations } = data;
  const totalDonors = donations?.length || 0;

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Total Donations</Typography>
            <Typography variant="h4" color="primary">${currentAmount}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Total Donors</Typography>
            <Typography variant="h4" color="primary">{totalDonors}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Average Donation</Typography>
            <Typography variant="h4" color="primary">
              ${totalDonors > 0 ? (currentAmount / totalDonors).toFixed(2) : 0}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Recent Donations</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Donor</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Interval</TableCell>
                  <TableCell align="right">Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentDonations.length > 0 ? (
                  recentDonations.map(donation => (
                    <TableRow key={donation._id}>
                      <TableCell>{donation.donatedBy?.name || 'Anonymous'}</TableCell>
                      <TableCell align="right">${donation.plan.amount}</TableCell>
                      <TableCell align="right">{donation.plan.interval}</TableCell>
                      <TableCell align="right">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">No recent donations</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Analytics;
