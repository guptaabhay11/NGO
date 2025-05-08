import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Avatar,
  Stack,
  Divider,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  Chip,
  Fade,
  useTheme
} from '@mui/material';
import { 
  Add as AddIcon, 
  AccountBalanceWallet as WalletIcon,
  AccountBalance as BankIcon,
  ArrowUpward as ArrowUpwardIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useAddBalanceMutation, useAddBankDetailsMutation } from '../../services/api';

const UserWallet: React.FC = () => {
  const theme = useTheme();
  const rawUser = useSelector((state: RootState) => state.auth.user);
  const user = rawUser?.data;

  const [tabIndex, setTabIndex] = useState(0);
  const [amount, setAmount] = useState<number>(0);
  const [bankDetails, setBankDetails] = useState<string>('');
  const [currentBalance, setCurrentBalance] = useState<number>(user?.amount || 0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [addBalance, { isLoading: loadingBalance }] = useAddBalanceMutation();
  const [addBankDetails, { isLoading: loadingBank }] = useAddBankDetailsMutation();

  useEffect(() => {
    if (user?.amount) {
      setCurrentBalance(user.amount);
    }
  }, [user?.amount]);

  const handleAddMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!user?.bankDetails) {
      setError('Please add your bank details first.');
      return;
    }

    if (amount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    try {
      await addBalance({ userId: user.id, amount }).unwrap();

      setCurrentBalance((prev) => prev + amount);
      setSuccess('Balance added successfully!');
      setAmount(0);
    } catch (err: any) {
      setError(err.data?.message || 'Failed to add balance');
    }
  };

  const handleBankSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (!user) {
        setError('User not found');
        return;
      }

      await addBankDetails({ userId: user.id, bankDetails }).unwrap();
      setSuccess('Bank details added!');
      setBankDetails('');
    } catch (err: any) {
      setError(err.data?.message || 'Failed to add bank details');
    }
  };

  if (!user) return null;

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
              {user?.name?.[0]?.toUpperCase() || '?'}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {user.name}
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

        {/* Tabs section */}
        <Paper sx={{ borderRadius: 3, mx: 3, mt: 1 }}>
          <Tabs 
            value={tabIndex} 
            onChange={(_, newIndex) => setTabIndex(newIndex)}
            variant="fullWidth"
            sx={{ 
              '& .MuiTab-root': { py: 2 },
              borderBottom: 1,
              borderColor: 'divider'
            }}
          >
            <Tab 
              label="Wallet Balance" 
              icon={<WalletIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Add Money" 
              icon={<AddIcon />} 
              iconPosition="start"
            />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {tabIndex === 0 && (
              <Fade in={tabIndex === 0}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Current Balance
                  </Typography>
                  <Stack 
                    direction="row" 
                    spacing={1} 
                    alignItems="baseline"
                    sx={{ mb: 2 }}
                  >
                    <Typography variant="h3" fontWeight="bold" color="primary">
                      ${currentBalance.toFixed(2)}
                    </Typography>
                    <Typography variant="caption" color="success.main">
                      Available
                    </Typography>
                  </Stack>

                  <Card 
                    variant="outlined" 
                    sx={{ 
                      bgcolor: 'grey.50', 
                      borderRadius: 2,
                      mt: 3
                    }}
                  >
                    <CardContent>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <BankIcon color="action" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Bank Account Connected
                          </Typography>
                          <Typography variant="body1">
                            {user.bankDetails ? 'Account ••••' + user.bankDetails.slice(-4) : 'Not connected'}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>

                  <Button
                    variant="contained"
                    startIcon={<ArrowUpwardIcon />}
                    fullWidth
                    sx={{ mt: 3, py: 1.5, borderRadius: 2 }}
                    onClick={() => setTabIndex(1)}
                  >
                    Add Money
                  </Button>
                </Box>
              </Fade>
            )}

            {tabIndex === 1 && (
              <Fade in={tabIndex === 1}>
                <Box
                  component="form"
                  onSubmit={user.bankDetails ? handleAddMoney : handleBankSubmit}
                >
                  {!user.bankDetails ? (
                    <>
                      <Typography variant="h6" gutterBottom color="primary.dark">
                        Connect Your Bank Account
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Please add your bank details to enable adding money to your wallet.
                      </Typography>
                      
                      <TextField
                        label="Account Number"
                        fullWidth
                        value={bankDetails}
                        onChange={(e) => setBankDetails(e.target.value)}
                        required
                        sx={{ mb: 3 }}
                        variant="outlined"
                        InputProps={{
                          startAdornment: <BankIcon color="action" sx={{ mr: 1 }} />,
                        }}
                      />
                      
                      <Button
                        fullWidth
                        variant="contained"
                        disabled={loadingBank}
                        type="submit"
                        sx={{ py: 1.5, borderRadius: 2 }}
                      >
                        {loadingBank ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          'Connect Bank Account'
                        )}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Typography variant="h6" gutterBottom color="primary.dark">
                        Add Money to Your Wallet
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Enter the amount you wish to add from your connected account.
                      </Typography>
                      
                      <TextField
                        fullWidth
                        label="Amount to Add"
                        type="number"
                        value={amount || ''}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        InputProps={{
                          startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                          inputProps: { min: 0.01, step: 0.01 },
                        }}
                        sx={{ mb: 3 }}
                        disabled={loadingBalance}
                        variant="outlined"
                      />
                      
                      <Card variant="outlined" sx={{ mb: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                        <CardContent>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" color="text.secondary">
                              Current Balance
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              ${currentBalance.toFixed(2)}
                            </Typography>
                          </Stack>
                          <Divider sx={{ my: 1.5 }} />
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" color="text.secondary">
                              New Balance
                            </Typography>
                            <Typography variant="body1" fontWeight="bold" color="primary.main">
                              ${(currentBalance + (amount || 0)).toFixed(2)}
                            </Typography>
                          </Stack>
                        </CardContent>
                      </Card>
                      
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={loadingBalance ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                        disabled={loadingBalance || amount <= 0}
                        type="submit"
                        sx={{ py: 1.5, borderRadius: 2 }}
                      >
                        {loadingBalance ? 'Processing...' : 'Add to Wallet'}
                      </Button>
                    </>
                  )}

                  {error && (
                    <Alert 
                      severity="error" 
                      sx={{ mt: 2, borderRadius: 2 }} 
                      onClose={() => setError(null)}
                    >
                      {error}
                    </Alert>
                  )}
                  
                  {success && (
                    <Alert 
                      severity="success" 
                      sx={{ mt: 2, borderRadius: 2 }} 
                      onClose={() => setSuccess(null)}
                      icon={<CheckIcon />}
                    >
                      {success}
                    </Alert>
                  )}
                </Box>
              </Fade>
            )}
          </Box>
        </Paper>
        
        <Box sx={{ p: 3, pt: 1 }}>
          <Typography variant="caption" color="rgba(255,255,255,0.7)" align="center" display="block">
            All transactions are secured and encrypted
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default UserWallet;