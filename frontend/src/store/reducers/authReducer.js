// src/store/reducers/authReducer.js

const initialState = {
    user: null,
    loading: false,
    error: null,
  };
  
  export default function authReducer(state = initialState, action) {
    switch(action.type) {
      case 'LOGIN_REQUEST':
      case 'REGISTER_REQUEST':
        return { ...state, loading: true, error: null };
      case 'LOGIN_SUCCESS':
        return { ...state, loading: false, user: action.payload };
      case 'REGISTER_SUCCESS':
        return { ...state, loading: false };
      case 'LOGIN_FAILURE':
      case 'REGISTER_FAILURE':
        return { ...state, loading: false, error: action.payload };
      case 'LOGOUT':
        return initialState;
      default:
        return state;
    }
  }
  