import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import FundsList from '../components/Fund/FundsList';
import { useGetRecentDonationsQuery } from '../services/api';

const HomePage: React.FC = () => {
  const accessToken = localStorage.getItem('access_token') 
  console.log("accessToken", accessToken)
  const { data: recentDonations } = useGetRecentDonationsQuery();
  console.log("recentDonations", recentDonations)

  return (
    <Box>
      {/* Hero Section */}
      <Paper 
        sx={{ 
          py: 8, 
          px: 3, 
          mb: 4, 
          background: 'linear-gradient(120deg, #2196f3, #3f51b5)',
          color: 'white',
          borderRadius: 0
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: { md: '60%' } }}>
            <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
              Make a Difference Today
            </Typography>
            <Typography variant="h6" paragraph sx={{ mb: 4 }}>
              Join our crowdfunding platform to support causes you care about. 
              Every donation, no matter how small, creates a huge impact.
            </Typography>
            {!accessToken ? (
              <Button 
                variant="contained" 
                size="large" 
                component={RouterLink} 
                to="/auth"
                sx={{ 
                  bgcolor: 'white', 
                  color: '#3f51b5',
                  '&:hover': { bgcolor: '#e0e0e0' } 
                }}
              >
                Join Now
              </Button>
            ) : (
              <Button 
                variant="contained" 
                size="large" 
                component={RouterLink} 
                to="/dashboard"
                sx={{ 
                  bgcolor: 'white', 
                  color: '#3f51b5',
                  '&:hover': { bgcolor: '#e0e0e0' } 
                }}
              >
                Dashboard
              </Button>
            )}
          </Box>
        </Container>
      </Paper>

      <Container maxWidth="lg" sx={{ mb: 8 }}>
        {/* Active Campaigns Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Active Campaigns
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <FundsList />
        </Box>

        {/* Recent Donations Section */}
        {recentDonations && recentDonations.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Recent Supporters
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap',
              gap: 2
            }}>
              {recentDonations.slice(0, 3).map((donation) => (
                <Box 
                  key={donation.id} 
                  sx={{ 
                    width: {
                      xs: '100%',
                      sm: 'calc(33.33% - 11px)'  // Accounting for gap
                    }
                  }}
                >
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {donation.userName}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Donated ${donation.amount}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(donation.date).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* How It Works Section */}
        <Box>
          <Typography variant="h4" component="h2" gutterBottom>
            How It Works
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4
          }}>
            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Typography variant="h5" component="h3" gutterBottom>
                  1. Choose a cause
                </Typography>
                <Typography variant="body1">
                  Browse through our active funding campaigns and select one that resonates with you.
                </Typography>
              </CardContent>
            </Card>
            
            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Typography variant="h5" component="h3" gutterBottom>
                  2. Set up your donation
                </Typography>
                <Typography variant="body1">
                  Choose a one-time donation or select a recurring plan that fits your budget.
                </Typography>
              </CardContent>
            </Card>
            
            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Typography variant="h5" component="h3" gutterBottom>
                  3. Make an impact
                </Typography>
                <Typography variant="body1">
                  Your contribution helps our NGO reach its goals and creates positive change in communities.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;