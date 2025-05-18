import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  Box,
  Typography,
  Paper,
  Avatar,
  Stack,
  Card,
  CardContent,
  Container,
  Chip,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Check as CheckIcon,
  History as HistoryIcon,
  Receipt as ReceiptIcon,
  CalendarToday as CalendarIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { format } from 'date-fns';
import { useGetDonationByIdQuery } from '../../services/api';
import type { Donation } from '../../types';

const UserWallet: React.FC = () => {
  const theme = useTheme();
  const user = useSelector((state: RootState) => state.auth.user);
  const [showAll, setShowAll] = useState(false);

  // Safe user name handling
  const getUserName = () => {
    if (!user) return 'User';
    if (typeof user.name === 'string') return user.name;
    if (user.name && typeof user.name === 'object') return 'User';
    return 'User';
  };

  const getAvatarLetter = () => {
    const name = getUserName();
    return name[0]?.toUpperCase() || 'U';
  };

  const getFundName = (fundId: any) => {
    if (typeof fundId === 'object' && fundId?.name) return fundId.name;
    if (typeof fundId === 'string') return fundId;
    return 'Unknown Fund';
  };

  // Fetch donation history
  const {
    data: donationResponse, 
    isLoading, 
    isError, 
    error 
  } = useGetDonationByIdQuery({ userId: user?.id || '' }, { skip: !user?.id });

  const donationHistory: Donation[] = donationResponse?.data?.donationHistory || [];
  const donationsToShow = showAll ? donationHistory : donationHistory.slice(0, 5);

  if (!user?.id) {
    return (
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Alert severity="error">User not found. Please log in.</Alert>
      </Container>
    );
  }

  const totalDonations = donationHistory.reduce(
    (sum: number, donation: Donation) => sum + donation.amount, 
    0
  );

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Paper 
        elevation={4} 
        sx={{ 
          borderRadius: 3,
          overflow: 'hidden',
          background: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
          color: 'white',
          position: 'relative'
        }}
      >
        {/* Header section */}
        <Box sx={{ p: 3, pb: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar 
              sx={{ 
                bgcolor: 'white', 
                color: 'primary.main', 
                width: 56, 
                height: 56,
                boxShadow: 1
              }}
            >
              {getAvatarLetter()}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {getUserName()}
              </Typography>
              <Chip 
                icon={<CheckIcon />} 
                label="Verified Account" 
                size="small" 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  mt: 0.5 
                }} 
              />
            </Box>
          </Stack>
        </Box>

        {/* Content section */}
        <Paper sx={{ borderRadius: 3, mx: 3, mt: 1, mb: 3 }}>
          <Box sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
              <HistoryIcon color="primary" />
              <Typography variant="h6" color="primary.dark">
                Donation History
              </Typography>
            </Stack>

            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : isError ? (
              <Alert severity="error" icon={<ErrorIcon />}>
                Error loading donation history: {error?.toString() || 'Unknown error'}
              </Alert>
            ) : donationHistory.length === 0 ? (
              <Card variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="text.secondary">
                  You haven't made any donations yet.
                </Typography>
              </Card>
            ) : (
              <>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'grey.50' }}>
                        <TableCell>Fund</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Invoice</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {donationsToShow.map((donation) => (
                        <TableRow key={donation._id}>
                          <TableCell>
                            <Typography fontWeight="medium">
                              {getFundName(donation.fundId)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography color="primary.main" fontWeight="bold">
                              ${donation.amount.toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <CalendarIcon fontSize="small" color="action" />
                              <Typography variant="body2">
                                {format(new Date(donation.paymentDate), 'MMM dd, yyyy')}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={donation.interval || 'one-time'} 
                              size="small"
                              color={donation.interval === 'monthly' ? 'primary' : 'default'}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              icon={<ReceiptIcon fontSize="small" />}
                              label="Receipt" 
                              size="small"
                              variant="outlined"
                              onClick={() => console.log('View receipt:', donation.stripeInvoiceId)}
                              clickable
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {donationHistory.length > 5 && (
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Button 
                      onClick={() => setShowAll(!showAll)}
                      variant="text"
                      size="small"
                    >
                      {showAll ? 'Show Less' : `Show All (${donationHistory.length})`}
                    </Button>
                  </Box>
                )}

                <Card variant="outlined" sx={{ mt: 3, bgcolor: 'grey.50' }}>
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Total Donations
                      </Typography>
                      <Typography variant="h6" fontWeight="bold">
                        ${totalDonations.toFixed(2)}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </>
            )}
          </Box>
        </Paper>
        
        <Box sx={{ p: 3, pt: 1 }}>
          <Typography variant="caption" color="rgba(255,255,255,0.7)" align="center" display="block">
            Thank you for your generous donations
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default UserWallet;
