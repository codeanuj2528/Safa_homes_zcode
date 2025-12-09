import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Tabs, Tab } from '@mui/material';
import { Home, History } from '@mui/icons-material';

const Navbar = ({ activeTab, setActiveTab }) => {
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Home sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            SafaHomes AI
          </Typography>
        </Box>

        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          textColor="inherit"
          sx={{ display: { xs: 'none', sm: 'flex' } }}
        >
          <Tab 
            value="generate" 
            label="Generate" 
            icon={<Home />} 
            iconPosition="start"
          />
          <Tab 
            value="history" 
            label="History" 
            icon={<History />} 
            iconPosition="start"
          />
        </Tabs>

        <Box sx={{ display: { xs: 'flex', sm: 'none' }, ml: 2 }}>
          <Button
            color="inherit"
            startIcon={<Home />}
            onClick={() => setActiveTab('generate')}
            variant={activeTab === 'generate' ? 'outlined' : 'text'}
            size="small"
            sx={{ mr: 1 }}
          >
            Generate
          </Button>
          <Button
            color="inherit"
            startIcon={<History />}
            onClick={() => setActiveTab('history')}
            variant={activeTab === 'history' ? 'outlined' : 'text'}
            size="small"
          >
            History
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;