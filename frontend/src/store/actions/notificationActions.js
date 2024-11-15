// src/store/actions/notificationActions.js

export const showNotification = (message, severity = 'success') => ({
    type: 'SHOW_NOTIFICATION',
    payload: { message, severity },
  });
  
  export const clearNotification = () => ({
    type: 'CLEAR_NOTIFICATION',
  });
  