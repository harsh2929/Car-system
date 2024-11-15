// src/pages/LoginPage.js

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/actions/authActions';
import { Formik, Form } from 'formik';
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import { styled } from '@mui/system';
import * as Yup from 'yup';
import './LoginPage.css'; // Import CSS for styles

const StyledTextField = styled(TextField)({
  marginTop: '16px',
  '& .MuiInputBase-root': {
    transition: 'border-color 0.3s ease-in-out',
  },
  '& .MuiInputLabel-root': {
    color: '#666', // Neutral label color
    fontSize: '14px', // Smaller label size for professionalism
    fontWeight: 500,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#ddd', // Subtle border
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#007aff', // Highlight on hover
  },
});

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

const LoginPage = ({ history }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = (values) => {
    dispatch(login(values, history));
  };

  return (
    <Box className="login-page">
      {/* Background Video */}
      <video autoPlay loop muted playsInline className="background-video">
        <source src={`${process.env.PUBLIC_URL}/promo.mp4`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Login Form */}
      <Container
        component="main"
        maxWidth="xs"
        className="login-form-container"
      >
        <Card
          sx={{
            padding: '32px',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.75)', // Semi-transparent background
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          }}
        >
          <CardContent>
            {/* Logo */}
            <CardMedia
              component="img"
              image={`${process.env.PUBLIC_URL}/logo.png`}
              alt="App Logo"
              sx={{
                height: 100,
                width: 100,
                margin: '0 auto 16px',
                borderRadius: '50%',
              }}
            />

            <Typography
              component="h1"
              variant="h5"
              sx={{ textAlign: 'center', marginBottom: '24px' }}
            >
              Welcome Back
            </Typography>

            {/* Error Message */}
            {error && (
              <Alert severity="error" sx={{ marginBottom: '16px' }}>
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={LoginSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, handleChange, values }) => (
                <Form>
                  <StyledTextField
                    fullWidth
                    id="email"
                    name="email"
                    label="Email Address"
                    variant="outlined"
                    value={values.email}
                    onChange={handleChange}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                  <StyledTextField
                    fullWidth
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    variant="outlined"
                    value={values.password}
                    onChange={handleChange}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    sx={{
                      marginTop: '24px',
                      height: '48px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      textTransform: 'none',
                    }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Login'}
                  </Button>
                </Form>
              )}
            </Formik>

            {/* Redirect to Register */}
            <Typography
              variant="body2"
              sx={{ textAlign: 'center', marginTop: '16px' }}
            >
              Don't have an account?{' '}
              <Button
                variant="text"
                color="primary"
                onClick={() => history.push('/register')}
                sx={{ fontSize: '14px', textTransform: 'none' }}
              >
                Register
              </Button>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;
