// src/store/reducers/notificationReducer.js

const initialState = {
  open: false,
  message: '',
  severity: 'success', // Options: 'error', 'warning', 'info', 'success'
};

export default function notificationReducer(state = initialState, action) {
  switch (action.type) {
    case 'SHOW_NOTIFICATION':
      return {
        open: true,
        message: action.payload.message,
        severity: action.payload.severity,
      };
    case 'CLEAR_NOTIFICATION':
      return initialState;
    default:
      return state;
  }
}
