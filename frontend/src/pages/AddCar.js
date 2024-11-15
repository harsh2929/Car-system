// src/pages/AddCar.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  TextField,
  Alert,
  CircularProgress,
  CardMedia,
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { addCar } from '../store/actions/carActions';

const AddCar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const initialValues = {
    title: '',
    description: '',
    tags: '',
    images: [],
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    tags: Yup.string().required('Tags are required'),
    images: Yup.mixed().required('At least one image is required'),
  });

  const handleImageChange = (e, setFieldValue) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      setError('You can upload up to 10 images.');
      return;
    }
    setFieldValue('images', files);

    // Generate image previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('tags', values.tags);
    values.images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      setLoading(true);
      await dispatch(addCar(formData, navigate));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add car');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1)',
                color: 'secondary.main',
              },
            }}>
        <Typography variant="h4" align="center">
          Add New Car
        </Typography>
      </Box>
      {error && <Alert severity="error">{error}</Alert>}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, setFieldValue, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            {/* Title Field */}
            <TextField
              fullWidth
              margin="normal"
              label="Title"
              name="title"
              value={values.title}
              onChange={handleChange}
              error={touched.title && Boolean(errors.title)}
              helperText={touched.title && errors.title}
            />

            {/* Description Field */}
            <TextField
              fullWidth
              margin="normal"
              label="Description"
              name="description"
              multiline
              rows={4}
              value={values.description}
              onChange={handleChange}
              error={touched.description && Boolean(errors.description)}
              helperText={touched.description && errors.description}
            />

            {/* Tags Field */}
            <TextField
              fullWidth
              margin="normal"
              label="Tags (comma separated)"
              name="tags"
              value={values.tags}
              onChange={handleChange}
              error={touched.tags && Boolean(errors.tags)}
              helperText={touched.tags && errors.tags}
            />

            {/* Image Upload */}
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
                onChange={(e) => handleImageChange(e, setFieldValue)}
              />
            </Button>
            {touched.images && errors.images && (
              <Typography color="error" variant="body2">
                {errors.images}
              </Typography>
            )}

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <Grid container spacing={2} sx={{ mb: 2 }}>
                {imagePreviews.map((src, index) => (
                  <Grid item xs={6} sm={4} key={index}>
                    <CardMedia
                      component="img"
                      src={src}
                      alt={`Preview ${index + 1}`}
                      sx={{
                        borderRadius: 1,
                        height: '140px',
                        objectFit: 'cover',
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Add Car'}
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default AddCar;
