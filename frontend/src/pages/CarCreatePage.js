// src/pages/CarCreatePage.js

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCar } from '../store/actions/carActions';
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
import { useHistory } from 'react-router-dom';

function CarCreatePage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { loading, error } = useSelector((state) => state.cars);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    images: [],
  });
  
  const [imagePreviews, setImagePreviews] = useState([]);
  
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
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
    
    dispatch(addCar(data, history));
  };
  
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h4">Add New Car</Typography>
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
          Upload Images
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
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ mt: 3, mb: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Create Car'}
        </Button>
      </Box>
    </Container>
  );
}

export default CarCreatePage;
