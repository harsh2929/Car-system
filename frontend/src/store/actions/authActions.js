// src/store/actions/authActions.js

import API from '../../services/api';
import { showNotification } from './notificationActions';

// Login Action
export const login = (formData, history) => async (dispatch) => {
  dispatch({ type: 'LOGIN_REQUEST' });
  try {
    const res = await API.post('/users/login', formData);
    localStorage.setItem('token', res.data.token); // Save token to localStorage
    dispatch({ type: 'LOGIN_SUCCESS', payload: res.data.user });
    dispatch(showNotification('Logged in successfully!', 'success'));
    history.push('/cars'); // Redirect to /cars
  } catch (error) {
    dispatch({
      type: 'LOGIN_FAILURE',
      payload: error.response ? error.response.data.message : error.message,
    });
    dispatch(showNotification(error.response ? error.response.data.message : error.message, 'error'));
  }
};

// Register Action
export const register = (formData, history) => async (dispatch) => {
  dispatch({ type: 'REGISTER_REQUEST' });
  try {
    const res = await API.post('/users/register', formData);
    dispatch({ type: 'REGISTER_SUCCESS' });
    dispatch(showNotification('Registered successfully! Please login.', 'success'));
    history.push('/login'); // Redirect to /login
  } catch (error) {
    dispatch({
      type: 'REGISTER_FAILURE',
      payload: error.response ? error.response.data.message : error.message,
    });
    dispatch(showNotification(error.response ? error.response.data.message : error.message, 'error'));
  }
};

// Logout Action
export const logout = () => (dispatch) => {
  localStorage.removeItem('token'); // Remove token from localStorage
  dispatch({ type: 'LOGOUT' });
  dispatch(showNotification('Logged out successfully!', 'success'));
};


export const setUserFromStorage = (user) => ({
  type: 'LOGIN_SUCCESS',
  payload: user,
});