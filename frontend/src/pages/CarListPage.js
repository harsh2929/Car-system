// src/pages/CarListPage.js

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCars } from '../store/actions/carActions';
import { Link, useHistory } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Alert,
  Pagination,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

function CarListPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { cars, loading, error, totalPages, currentPage } = useSelector((state) => state.cars);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [myCarsOnly, setMyCarsOnly] = useState(true); // Default selection to "My Cars"

  useEffect(() => {
    dispatch(fetchCars(search, page, 6, myCarsOnly));
  }, [dispatch, search, page, myCarsOnly]);

  const handleCardClick = (id) => {
    history.push(`/cars/${id}`);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleToggleChange = (event, newValue) => {
    if (newValue !== null) {
      setMyCarsOnly(newValue === 'my');
      setPage(1); // Reset to the first page when toggling
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        height: 'calc(100vh - 100px)', // Allow space for header/footer
        overflowY: 'auto', // Enable vertical scrolling
        padding: '16px',
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          {myCarsOnly ? 'My Cars' : 'All Cars'}
        </Typography>
      </Box>

      {/* Toggle Button Group */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
        <ToggleButtonGroup
          value={myCarsOnly ? 'my' : 'all'} // Reflect default selection
          exclusive
          onChange={handleToggleChange}
          aria-label="Car Filter"
          sx={{ mb: 2 }}
        >
          <ToggleButton value="my" aria-label="My Cars">
            My Cars
          </ToggleButton>
          <ToggleButton value="all" aria-label="All Cars">
            All Cars
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
        <TextField
          variant="outlined"
          placeholder="Search Cars..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            width: '100%',
            maxWidth: '400px',
            borderRadius: '50px',
            backgroundColor: '#fff',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          }}
        />
      </Box>

      {/* Loading and Error States */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : cars.length === 0 ? (
        <Typography variant="h6" align="center" color="text.secondary">
          No cars found. Try searching for something else or add a new car!
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {cars.map((car) => (
            <Grid item key={car._id} xs={12} sm={6} md={4}>
              <Card
                onClick={() => handleCardClick(car._id)}
                sx={{
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    car.images[0]
                      ? `https://car-system-backend-1.onrender.com/${car.images[0]}`
                      : 'https://via.placeholder.com/200'
                  }
                  alt={car.title}
                  sx={{ borderRadius: '4px' }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {car.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {car.description.substring(0, 100)}...
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Container>
  );
}

export default CarListPage;
