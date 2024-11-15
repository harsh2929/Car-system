// src/components/Layout.js

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import { CarRental, Logout } from '@mui/icons-material';
import { Link, useHistory } from 'react-router-dom'; // Import useHistory
import { useDispatch } from 'react-redux';
import { logout } from '../store/actions/authActions';

const drawerWidth = 240;

function Layout({ children }) {
  const dispatch = useDispatch();
  const history = useHistory(); // Use useHistory instead of useNavigate

  const handleLogout = () => {
    dispatch(logout());
    history.push('/login'); // Redirect using history.push
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* AppBar */}
      <AppBar position="fixed" color="primary" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <CarRental sx={{ mr: 2 }} />
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Car Management App
          </Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            sx={{
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1)',
                color: 'secondary.main',
              },
            }}
            startIcon={<Logout />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem
              button
              component={Link}
              to="/cars"
              sx={{
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  backgroundColor: 'primary.light',
                },
              }}
            >
              <ListItemIcon>
                <CarRental />
              </ListItemIcon>
              <ListItemText primary="My Cars" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/cars/new"
              sx={{
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  backgroundColor: 'primary.light',
                },
              }}
            >
              <ListItemIcon>
                <CarRental />
              </ListItemIcon>
              <ListItemText primary="Add New Car" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

export default Layout;
