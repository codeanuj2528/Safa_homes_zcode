import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Image, Delete, Visibility, Refresh } from '@mui/icons-material';
import axios from 'axios';

const History = ({ userId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [userId]);

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get('http://localhost:8000/history', {
        params: { user_id: userId }
      });
      
      if (response.data.success) {
        setHistory(response.data.history);
      } else {
        setError('Failed to load history');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  if (loading) {
    return (
      <Box className="loading-spinner">
        <CircularProgress />
        <Typography>Loading history...</Typography>
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">
            Generation History
          </Typography>
          <Box>
            <Button
              startIcon={<Refresh />}
              onClick={fetchHistory}
              sx={{ mr: 1 }}
            >
              Refresh
            </Button>
            <Button
              startIcon={<Delete />}
              onClick={clearHistory}
              color="error"
              variant="outlined"
            >
              Clear All
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {history.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Image sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No generation history yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start generating designs to see them here!
            </Typography>
          </Box>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Showing {history.length} recent generations
            </Typography>
            
            <List>
              {history.map((item) => (
                <ListItem
                  key={item.id}
                  alignItems="flex-start"
                  sx={{
                    bgcolor: 'background.paper',
                    mb: 1,
                    borderRadius: 1,
                    border: 1,
                    borderColor: 'divider'
                  }}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleViewDetails(item)}>
                      <Visibility />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {item.id}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body1" component="div">
                        {item.prompt}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          label={item.user_id}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(item.timestamp)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </CardContent>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        {selectedItem && (
          <>
            <DialogTitle>Generation Details</DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Prompt:
                </Typography>
                <Typography variant="body1" paragraph sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                  {selectedItem.prompt}
                </Typography>
                
                <Typography variant="subtitle1" gutterBottom>
                  Generated on:
                </Typography>
                <Typography variant="body2" paragraph>
                  {formatDate(selectedItem.timestamp)}
                </Typography>
                
                <Typography variant="subtitle1" gutterBottom>
                  User ID:
                </Typography>
                <Typography variant="body2">
                  {selectedItem.user_id}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Card>
  );
};

export default History;