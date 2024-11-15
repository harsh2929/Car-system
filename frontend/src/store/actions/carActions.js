
import API from '../../services/api';
import { showNotification } from './notificationActions';

// Fetch Cars Action (with My Cars Filter)
export const fetchCars = (searchTerm = '', page = 1, limit = 6, myCarsOnly = false) => async (dispatch) => {
  dispatch({ type: 'FETCH_CARS_REQUEST' });
  try {
    const res = await API.get('/cars', {
      params: { search: searchTerm, page, limit, myCars: myCarsOnly },
    });
    dispatch({ type: 'FETCH_CARS_SUCCESS', payload: res.data });
  } catch (error) {
    dispatch({
      type: 'FETCH_CARS_FAILURE',
      payload: error.response ? error.response.data.message : error.message,
    });
    dispatch(
      showNotification(
        error.response ? error.response.data.message : error.message,
        'error'
      )
    );
  }
};

// Fetch Car Details Action
export const fetchCarDetails = (id) => async (dispatch) => {
  dispatch({ type: 'FETCH_CAR_DETAILS_REQUEST' });
  try {
    const res = await API.get(`/cars/${id}`);
    dispatch({ type: 'FETCH_CAR_DETAILS_SUCCESS', payload: res.data });
  } catch (error) {
    dispatch({
      type: 'FETCH_CAR_DETAILS_FAILURE',
      payload: error.response ? error.response.data.message : error.message,
    });
    dispatch(showNotification(error.response ? error.response.data.message : error.message, 'error'));
  }
};

// Add Car Action
export const addCar = (formData, history) => async (dispatch) => {
  dispatch({ type: 'ADD_CAR_REQUEST' });
  try {
    const res = await API.post('/cars', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    dispatch({ type: 'ADD_CAR_SUCCESS', payload: res.data });
    dispatch(showNotification('Car added successfully!', 'success'));
    history.push('/cars'); // Redirect to /cars
  } catch (error) {
    dispatch({
      type: 'ADD_CAR_FAILURE',
      payload: error.response ? error.response.data.message : error.message,
    });
    dispatch(showNotification(error.response ? error.response.data.message : error.message, 'error'));
  }
};

// Update Car Action
export const updateCar = (id, formData, history) => async (dispatch) => {
  dispatch({ type: 'UPDATE_CAR_REQUEST' });
  try {
    const res = await API.put(`/cars/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    dispatch({ type: 'UPDATE_CAR_SUCCESS', payload: res.data });
    dispatch(showNotification('Car updated successfully!', 'success'));
    history.push(`/cars/${id}`); // Redirect to car detail
  } catch (error) {
    dispatch({
      type: 'UPDATE_CAR_FAILURE',
      payload: error.response ? error.response.data.message : error.message,
    });
    dispatch(showNotification(error.response ? error.response.data.message : error.message, 'error'));
  }
};

// Delete Car Action
export const deleteCar = (id, history) => async (dispatch) => {
  dispatch({ type: 'DELETE_CAR_REQUEST' });
  try {
    await API.delete(`/cars/${id}`);
    dispatch({ type: 'DELETE_CAR_SUCCESS', payload: id });
    dispatch(showNotification('Car deleted successfully!', 'success'));
    history.push('/cars'); // Redirect to /cars
  } catch (error) {
    dispatch({
      type: 'DELETE_CAR_FAILURE',
      payload: error.response ? error.response.data.message : error.message,
    });
    dispatch(showNotification(error.response ? error.response.data.message : error.message, 'error'));
  }
};
