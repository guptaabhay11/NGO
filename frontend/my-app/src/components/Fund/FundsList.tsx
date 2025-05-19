import React from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Button,
  Alert,
  Chip,
  Divider,
  useTheme,
  LinearProgress,
  Avatar,
  CardHeader,
  IconButton,
  Tooltip,
  Paper
} from "@mui/material";
import { 
  MonetizationOn as MoneyIcon,
  AccessTime as TimeIcon,
  Info as InfoIcon,
  Bookmark as BookmarkIcon,
  Check as CheckIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material';
import { useGetAllFundsQuery } from "../../services/api";
import { useNavigate } from "react-router-dom";

const FundList: React.FC = () => {
  const { data: response, isLoading, error } = useGetAllFundsQuery();
  const funds = response?.data ?? [];
  const navigate = useNavigate();
  const theme = useTheme();

  console.log("funds", funds)
  // Function to get random color for fund avatars - for visual variety
  const getRandomColor = (seed: string) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.info.main,
      theme.palette.success.main,
      theme.palette.warning.main,
    ];
    const index = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  // Calculate percentage complete for progress bar
  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  // Format plan name to look nicer
  const formatPlanName = (plan?: string) => {
    if (typeof plan !== 'string' || !plan.length) return "Unknown";
    return plan.charAt(0).toUpperCase() + plan.slice(1);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" minHeight="60vh" gap={2}>
        <CircularProgress size={60} thickness={4} color="primary" />
        <Typography variant="body1" color="text.secondary">
          Loading funds...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ 
          my: 4, 
          mx: 'auto', 
          maxWidth: 600,
          borderRadius: 2,
          boxShadow: theme.shadows[3]
        }}
      >
        Error fetching funds: {(error as any)?.data?.message || "Unknown error"}
      </Alert>
    );
  }

  if (!Array.isArray(funds)) {
    return (
      <Alert 
        severity="error" 
        sx={{ 
          my: 4, 
          mx: 'auto', 
          maxWidth: 600,
          borderRadius: 2,
          boxShadow: theme.shadows[3]
        }}
      >
        Invalid data format received from server.
      </Alert>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: theme.breakpoints.values.xl, mx: 'auto' }}>
      <Box
        sx={{
          mb: 6,
          textAlign: 'center',
          position: 'relative',
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: -12,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 120,
            height: 4,
            backgroundColor: theme.palette.primary.main,
            borderRadius: 2
          }
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: theme.palette.primary.main,
            textAlign: 'center',
          }}
        >
          Available Funds
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Browse and contribute to our active fundraising campaigns
        </Typography>
      </Box>

      {funds.length === 0 ? (
        <Paper 
          elevation={3} 
          sx={{ 
            textAlign: "center", 
            py: 8, 
            px: 4,
            borderRadius: 4,
            backgroundColor: theme.palette.grey[50]
          }}
        >
          <MoneyIcon sx={{ fontSize: 60, color: theme.palette.text.secondary, opacity: 0.5, mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No funds available yet
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Check back soon for new fundraising opportunities
          </Typography>
        </Paper>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(auto-fill, minmax(300px, 1fr))",
              md: "repeat(auto-fill, minmax(320px, 1fr))"
            },
            gap: 4
          }}
        >
          {funds.map((fund) => {
            const progress = calculateProgress(fund.currentAmount, fund.targetAmount);
            const avatarColor = getRandomColor(fund._id);
            
            return (
              <Card
                key={String(fund._id)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.shadows[10],
                  },
                  position: 'relative'
                }}
                elevation={4}
              >
                {/* Status indicator */}
                {fund.isActive && (
                  <Chip
                    icon={<CheckIcon fontSize="small" />}
                    label="Active"
                    color="success"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      zIndex: 2,
                      fontWeight: 'bold'
                    }}
                  />
                )}
                {!fund.isActive && (
                  <Chip
                    label="Completed"
                    color="default"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      zIndex: 2
                    }}
                  />
                )}

                {/* Card Header with Avatar */}
                <CardHeader
                  avatar={
                    <Avatar
                      sx={{
                        bgcolor: avatarColor,
                        width: 50,
                        height: 50,
                        boxShadow: theme.shadows[2]
                      }}
                    >
                      {fund.name.charAt(0).toUpperCase()}
                    </Avatar>
                  }
                  title={
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                      {fund.name}
                    </Typography>
                  }
                  subheader={
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <TimeIcon fontSize="small" sx={{ color: theme.palette.text.secondary, mr: 0.5 }} />
                      <Typography variant="caption" color="text.secondary">
                        {formatPlanName(fund.plan)}
                      </Typography>
                    </Box>
                  }
                  sx={{ pt: 3, pb: 1 }}
                />

                <Divider sx={{ mx: 2 }} />

                <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                  {/* Description */}
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      minHeight: 60,
                      mb: 3,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {fund.description}
                  </Typography>

                  {/* Fund Progress */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" fontWeight="500">
                        Progress
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" color={progress >= 80 ? 'success.main' : 'text.primary'}>
                        {progress}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={progress} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 1,
                        bgcolor: theme.palette.grey[200],
                      }} 
                    />
                  </Box>

                  {/* Financial Info */}
                  <Box sx={{ 
                    bgcolor: theme.palette.grey[50], 
                    p: 2, 
                    borderRadius: 2,
                    boxShadow: 'inset 0 0 5px rgba(0,0,0,0.03)'
                  }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <MoneyIcon fontSize="small" sx={{ color: theme.palette.primary.main, mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          Raised:
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="bold" color="primary.main">
                        ${fund.currentAmount.toLocaleString()}
                      </Typography>
                    </Box>
                    
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <InfoIcon fontSize="small" sx={{ color: theme.palette.secondary.main, mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          Target:
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="medium">
                        ${fund.targetAmount.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    size="large"
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/fund/${fund._id}`)}
                    sx={{ 
                      borderRadius: 2,
                      py: 1.2,
                      fontWeight: 'bold',
                      '&:hover': {
                        boxShadow: theme.shadows[8]
                      }
                    }}
                    endIcon={<ArrowIcon />}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default FundList;