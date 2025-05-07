import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button,
  Card,
  CardContent,
  Divider,
  Chip,
  Avatar,
  useTheme
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useGetRecentDonationsQuery } from '../services/api';
import FundsList from '../components/Fund/FundsList';

const HomePage: React.FC = () => {
  const accessToken = localStorage.getItem('access_token');
  const { data: recentDonations } = useGetRecentDonationsQuery();
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: theme.palette.background.default }}>
      {/* Hero Section */}
      <Paper 
        sx={{ 
          py: { xs: 6, md: 12 },
          px: 2, 
          mb: 6,
          background: 'linear-gradient(135deg, #1976d2 0%, #303f9f 100%)',
          color: 'white',
          borderRadius: 0,
          boxShadow: theme.shadows[10]
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ 
            maxWidth: { md: '65%' },
            textAlign: { xs: 'center', md: 'left' }
          }}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 800,
                letterSpacing: 1,
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}
            >
              Make a Difference Today
            </Typography>
            <Typography 
              variant="h5" 
              paragraph 
              sx={{ 
                mb: 4,
                lineHeight: 1.6,
                fontSize: { xs: '1.1rem', md: '1.25rem' }
              }}
            >
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
                  color: theme.palette.primary.main,
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': { 
                    bgcolor: 'rgba(255,255,255,0.9)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
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
                  color: theme.palette.primary.main,
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': { 
                    bgcolor: 'rgba(255,255,255,0.9)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
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
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              color: theme.palette.text.primary
            }}
          >
            Active Campaigns
          </Typography>
          <Divider 
            sx={{ 
              mb: 4,
              height: 4,
              width: 100,
              bgcolor: theme.palette.primary.main,
              borderRadius: 2
            }} 
          />
          <FundsList />
        </Box>
        {/* How It Works Section */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              color: theme.palette.text.primary
            }}
          >
            How It Works
          </Typography>
          <Divider 
            sx={{ 
              mb: 4,
              height: 4,
              width: 100,
              bgcolor: theme.palette.primary.main,
              borderRadius: 2
            }} 
          />
          
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { 
              xs: '1fr', 
              md: 'repeat(3, 1fr)' 
            },
            gap: 4
          }}>
            <Card 
              sx={{ 
                p: 3,
                textAlign: 'center',
                borderTop: `4px solid ${theme.palette.primary.main}`
              }}
            >
              <Box 
                sx={{ 
                  width: 60,
                  height: 60,
                  bgcolor: theme.palette.primary.light,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3
                }}
              >
                <Typography variant="h4" color="primary">1</Typography>
              </Box>
              <Typography variant="h5" component="h3" gutterBottom>
                Choose a cause
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Browse through our active funding campaigns and select one that resonates with you.
              </Typography>
            </Card>
            
            <Card 
              sx={{ 
                p: 3,
                textAlign: 'center',
                borderTop: `4px solid ${theme.palette.secondary.main}`
              }}
            >
              <Box 
                sx={{ 
                  width: 60,
                  height: 60,
                  bgcolor: theme.palette.secondary.light,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3
                }}
              >
                <Typography variant="h4" color="secondary">2</Typography>
              </Box>
              <Typography variant="h5" component="h3" gutterBottom>
                Set up your donation
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Choose a one-time donation or select a recurring plan that fits your budget.
              </Typography>
            </Card>
            
            <Card 
              sx={{ 
                p: 3,
                textAlign: 'center',
                borderTop: `4px solid ${theme.palette.success.main}`
              }}
            >
              <Box 
                sx={{ 
                  width: 60,
                  height: 60,
                  bgcolor: theme.palette.success.light,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3
                }}
              >
                <Typography variant="h4" color="success">3</Typography>
              </Box>
              <Typography variant="h5" component="h3" gutterBottom>
                Make an impact
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Your contribution helps our NGO reach its goals and creates positive change in communities.
              </Typography>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage; 