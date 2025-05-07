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
} from "@mui/material";
import { useGetAllFundsQuery } from "../../services/api";
import { useNavigate } from "react-router-dom";

const FundList: React.FC = () => {
  const { data: response, isLoading, error } = useGetAllFundsQuery();
  const funds = response?.data ?? [];  // Access the data property of the response

  const navigate = useNavigate();

  // Loader during data fetch
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  // Error handling if any
  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        Error fetching funds: {(error as any)?.data?.message || "Unknown error"}
      </Alert>
    );
  }

  // Check if the data format is valid
  if (!Array.isArray(funds)) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        Invalid data format received from server.
      </Alert>
    );
  }

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        All Funds
      </Typography>

      <Box display="flex" flexWrap="wrap" gap={2} justifyContent="flex-start">
        {funds.map((fund) => (
          <Card
            key={String(fund._id)}
            sx={{
              width: 300,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <CardContent>
              <Typography variant="h6">{fund.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {fund.description}
              </Typography>
              <Typography variant="body2">
                Target: ${fund.targetAmount}
              </Typography>
              <Typography variant="body2">
                Raised: ${fund.currentAmount}
              </Typography>
              <Typography variant="body2">Plan: {fund.plan}</Typography>
              <Typography variant="body2">
                Active: {fund.isActive ? "Yes" : "No"}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                color="primary"
                onClick={() => navigate(`/fund/${fund._id}`)}
              >
                View Details
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default FundList;