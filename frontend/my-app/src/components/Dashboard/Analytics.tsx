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

import { useGetFundAnalyticsQuery } from '../../services/api';

interface AnalyticsProps {
  fundId: string;
}

const Analytics: React.FC<AnalyticsProps> = ({ fundId }) => {
  const { data, isLoading, error } = useGetFundAnalyticsQuery({ fundId });

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
        Failed to load analytics data.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Stats Cards using Flexbox instead of Grid */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        gap: 3,
        mb: 3
      }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total Donations
            </Typography>
            <Typography variant="h4" color="primary">
              ${data.totalDonations}
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total Donors
            </Typography>
            <Typography variant="h4" color="primary">
              {data.donors}
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Average Donation
            </Typography>
            <Typography variant="h4" color="primary">
              ${data.donors > 0 ? (data.totalDonations / data.donors).toFixed(2) : 0}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Recent Donations */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Donations
          </Typography>
          
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
                {data.recentDonations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell component="th" scope="row">
                      {donation.userName}
                    </TableCell>
                    <TableCell align="right">${donation.amount}</TableCell>
                    <TableCell align="right">{donation.interval}</TableCell>
                    <TableCell align="right">
                      {new Date(donation.date).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
                
                {data.recentDonations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No recent donations
                    </TableCell>
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