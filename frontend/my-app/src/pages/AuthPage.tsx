import React from 'react';
import { 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  Button, 
  LinearProgress, 
  Box 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Fund } from '../services/api';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface FundCardProps {
  fund: Fund;
  onDonate: (fund: Fund) => void;
  onDelete?: (fundId: string) => void;
}

const FundCard: React.FC<FundCardProps> = ({ fund, onDonate, onDelete }) => {
  const navigate = useNavigate();
  const { isAdmin } = useSelector((state: RootState) => state.auth);
  
  const progress = Math.min((fund.currentAmount / fund.targetAmount) * 100, 100);
  const isFundClosed = progress >= 100;

  const handleViewDetails = () => {
    navigate(`/fund/${fund.id}`);
  };

  return (
    <Card sx={{ mb: 3, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {fund.name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {fund.description}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Progress: {progress.toFixed(0)}%
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ${fund.currentAmount} of ${fund.targetAmount}
          </Typography>
        </Box>
        
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          color={isFundClosed ? "success" : "primary"}
          sx={{ height: 8, borderRadius: 4 }}
        />
        
        {isFundClosed && (
          <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
            Target reached! Fund closed.
          </Typography>
        )}
      </CardContent>
      
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button 
          size="small" 
          onClick={handleViewDetails}
        >
          View Details
        </Button>
        
        <Button 
          size="small" 
          variant="contained" 
          onClick={() => onDonate(fund)}
          disabled={isFundClosed}
          sx={{ ml: 1 }}
        >
          Donate
        </Button>
        
        {isAdmin && onDelete && (
          <Button 
            size="small" 
            color="error" 
            onClick={() => onDelete(fund.id)}
            sx={{ ml: 'auto' }}
          >
            Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default FundCard;