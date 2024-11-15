// src/pages/CarEditPage.js

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCarDetails, updateCar } from '../store/actions/carActions';
import { useHistory, useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

function CarEditPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const { selectedCar, loading, error } = useSelector((state) => state.cars);
  const currentUser = useSelector((state) => state.auth.user);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    images: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    dispatch(fetchCarDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedCar) {
      // Check if the current user is the owner
      if (selectedCar.userId._id !== currentUser.id) {
        history.push(`/cars/${id}`);
      } else {
        setFormData({
          title: selectedCar.title,
          description: selectedCar.description,
          tags: selectedCar.tags.join(', '),
          images: [],
        });
        setImagePreviews([]);
      }
    }
  }, [selectedCar, currentUser, history, id]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedCar.images.length > 10) {
      alert('You can upload up to 10 images.');
      return;
    }
    setFormData({ ...formData, images: files });

    // Generate image previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('tags', formData.tags);

    formData.images.forEach((image) => {
      data.append('images', image);
    });

    dispatch(updateCar(id, data, history));
  };

  if (loading || !selectedCar) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h4">Edit Car</Typography>
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Title"
          name="title"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Description"
          name="description"
          multiline
          rows={4}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <TextField
          margin="normal"
          fullWidth
          label="Tags (comma separated)"
          name="tags"
          value={formData.tags}
          onChange={(e) =>
            setFormData({ ...formData, tags: e.target.value })
          }
        />
        <Button
          variant="contained"
          component="label"
          startIcon={<AddPhotoAlternateIcon />}
          sx={{ mt: 2, mb: 2 }}
        >
          Upload Additional Images
          <input
            type="file"
            hidden
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
        </Button>
        {imagePreviews.length > 0 && (
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {imagePreviews.map((src, index) => (
              <Grid item xs={6} sm={4} key={index}>
                <Box
                  component="img"
                  src={src}
                  alt={`Preview ${index + 1}`}
                  sx={{ width: '100%', height: 'auto', borderRadius: 1 }}
                />
              </Grid>
            ))}
          </Grid>
        )}
        <Typography variant="h6">Existing Images</Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {selectedCar.images.length > 0 ? (
            selectedCar.images.map((img, index) => (
              <Grid item xs={6} sm={4} key={index}>
                <Box
                  component="img"
                  src={`http://localhost:5000/${img}`}
                  alt={`Car Image ${index + 1}`}
                  sx={{ width: '100%', height: 'auto', borderRadius: 1 }}
                />
              </Grid>
            ))
          ) : (
            <Typography>No images available.</Typography>
          )}
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ mt: 3, mb: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Update Car'}
        </Button>
      </Box>
    </Container>
  );
}

export default CarEditPage;
