import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Paper,
  Chip,
  IconButton
} from '@mui/material';
import { Send, Refresh, Download } from '@mui/icons-material';
import axios from 'axios';

const ImageGenerator = ({ userId }) => {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  const examplePrompts = [
    "Modern minimalist living room with white walls and wooden floors",
    "Cozy Scandinavian bedroom with natural light",
    "Luxury kitchen with marble countertops and island",
    "Modern exterior of a house with large windows and garden",
    "Contemporary bathroom with freestanding bathtub",
    "Open concept living area with fireplace",
    "Minimalist home office with ergonomic furniture",
    "Rustic farmhouse kitchen with exposed beams",
    "Modern pool house with glass walls",
    "Japanese-inspired bedroom with tatami mats"
  ];

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setGenerating(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('http://localhost:8000/generate', {
        prompt,
        user_id: userId
      });

      if (response.data.success) {
        setResult(response.data);
        // Add to local history
        setHistory(prev => [{
          id: Date.now(),
          prompt,
          timestamp: new Date().toISOString(),
          image: response.data.image
        }, ...prev.slice(0, 4)]);
      } else {
        setError('Failed to generate image');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate image');
    } finally {
      setGenerating(false);
    }
  };

  const handleExampleClick = (example) => {
    setPrompt(example);
  };

  const downloadImage = () => {
    if (!result?.image) return;
    
    const link = document.createElement('a');
    link.href = result.image;
    link.download = `safahomes-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Describe Your Dream Space
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                label="Enter your design prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Modern minimalist living room with white walls and wooden floors"
                disabled={generating}
                sx={{ mb: 2 }}
              />

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Try these examples:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {examplePrompts.map((example, index) => (
                    <Chip
                      key={index}
                      label={example}
                      onClick={() => handleExampleClick(example)}
                      size="small"
                      clickable
                      disabled={generating}
                    />
                  ))}
                </Box>
              </Box>

              <Button
                variant="contained"
                size="large"
                startIcon={generating ? <CircularProgress size={20} color="inherit" /> : <Send />}
                onClick={generateImage}
                disabled={generating || !prompt.trim()}
                fullWidth
              >
                {generating ? 'Generating...' : 'Generate Design'}
              </Button>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </CardContent>
          </Card>

          {result && (
            <Card sx={{ mt: 3 }} className="result-container">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Your Generated Design
                  </Typography>
                  <IconButton onClick={downloadImage} color="primary">
                    <Download />
                  </IconButton>
                </Box>
                
                <CardMedia
                  component="img"
                  image={result.image}
                  alt="Generated design"
                  className="image-preview"
                />
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Original prompt: {result.prompt}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Generated at: {new Date(result.timestamp).toLocaleString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Generations
              </Typography>
              
              {history.length === 0 ? (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                  No recent generations. Your designs will appear here.
                </Typography>
              ) : (
                <Box>
                  {history.map((item) => (
                    <Paper
                      key={item.id}
                      sx={{
                        p: 2,
                        mb: 2,
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                      onClick={() => {
                        setPrompt(item.prompt);
                        if (item.image) {
                          setResult({ image: item.image, prompt: item.prompt });
                        }
                      }}
                      className="history-item"
                    >
                      <Typography variant="body2" gutterBottom>
                        {item.prompt.length > 50 
                          ? `${item.prompt.substring(0, 50)}...` 
                          : item.prompt}
                      </Typography>
                      {item.image && (
                        <CardMedia
                          component="img"
                          image={item.image}
                          alt="History image"
                          sx={{ borderRadius: 1, mt: 1 }}
                        />
                      )}
                      <Typography variant="caption" color="text.secondary">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </Typography>
                    </Paper>
                  ))}
                  
                  {history.length > 0 && (
                    <Button
                      fullWidth
                      startIcon={<Refresh />}
                      onClick={() => setHistory([])}
                      size="small"
                    >
                      Clear History
                    </Button>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                💡 Tips for Better Results
              </Typography>
              <Typography variant="body2" paragraph>
                • Be specific about styles (modern, rustic, Scandinavian)
              </Typography>
              <Typography variant="body2" paragraph>
                • Mention materials (wood, marble, glass)
              </Typography>
              <Typography variant="body2" paragraph>
                • Include lighting conditions (natural light, warm lighting)
              </Typography>
              <Typography variant="body2" paragraph>
                • Describe colors and textures
              </Typography>
              <Typography variant="body2">
                • Add architectural elements (vaulted ceilings, large windows)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ImageGenerator;