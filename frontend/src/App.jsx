import React, { useState } from 'react';
import './App.css';
import ImageGenerator from './components/ImageGenerator';
import History from './components/History';
import Navbar from './components/Navbar';
import { Container, Box, Typography } from '@mui/material';

function App() {
  const [activeTab, setActiveTab] = useState('generate');
  const [userId, setUserId] = useState('user_' + Math.random().toString(36).substr(2, 9));

  return (
    <div className="App">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center" color="primary">
          🏠 SafaHomes AI Interior Designer
        </Typography>
        
        <Typography variant="body1" paragraph align="center" color="text.secondary">
          Generate beautiful interior and exterior designs using AI
        </Typography>

        <Box sx={{ mt: 4 }}>
          {activeTab === 'generate' ? (
            <ImageGenerator userId={userId} />
          ) : (
            <History userId={userId} />
          )}
        </Box>

        <Box sx={{ mt: 6, py: 3, textAlign: 'center', borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary">
            Powered by Stable Diffusion AI • Made for SafaHomes
          </Typography>
        </Box>
      </Container>
    </div>
  );
}

export default App;