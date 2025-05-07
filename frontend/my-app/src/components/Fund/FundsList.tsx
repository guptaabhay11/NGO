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
} from "@mui/material";
import { useGetAllFundsQuery } from "../../services/api";
import { useNavigate } from "react-router-dom";

const FundList: React.FC = () => {
  const { data: response, isLoading, error } = useGetAllFundsQuery();
  const funds = response?.data ?? [];
  const navigate = useNavigate();
  const theme = useTheme();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 4, mx: 'auto', maxWidth: 600 }}>
        Error fetching funds: {(error as any)?.data?.message || "Unknown error"}
      </Alert>
    );
  }

  if (!Array.isArray(funds)) {
    return (
      <Alert severity="error" sx={{ my: 4, mx: 'auto', maxWidth: 600 }}>
        Invalid data format received from server.
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: theme.breakpoints.values.lg, mx: 'auto' }}>
      <Typography 
        variant="h3" 
        gutterBottom 
        sx={{ 
          fontWeight: 700,
          color: theme.palette.primary.main,
          mb: 4,
          textAlign: 'center'
        }}
      >
        All Funds
      </Typography>

      {funds.length === 0 ? (
        <Box textAlign="center" py={6}>
          <Typography variant="h6" color="text.secondary">
            No funds available yet
          </Typography>
        </Box>
      ) : (
        <Box 
          display="grid" 
          gridTemplateColumns="repeat(auto-fill, minmax(320px, 1fr))" 
          gap={3}
        >
          {funds.map((fund) => (
            <Card
              key={String(fund._id)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[6],
                },
              }}
              elevation={4}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {fund.name}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1" paragraph sx={{ minHeight: 60 }}>
                  {fund.description}
                </Typography>
                
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Target:
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    ${fund.targetAmount.toLocaleString()}
                  </Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Raised:
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    ${fund.currentAmount.toLocaleString()}
                  </Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    Plan:
                  </Typography>
                  <Chip 
                    label={fund.plan} 
                    size="small" 
                    color="secondary"
                  />
                </Box>
                
                <Chip
                  label={fund.isActive ? "Active" : "Inactive"}
                  color={fund.isActive ? "success" : "default"}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </CardContent>
              
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button
                  size="medium"
                  variant="contained"
                  onClick={() => navigate(`/fund/${fund._id}`)}
                  sx={{ mb: 2, mr: 2 }}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default FundList;