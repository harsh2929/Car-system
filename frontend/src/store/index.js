import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import authReducer from './reducers/authReducer';
import carReducer from './reducers/carReducer';
import notificationReducer from './reducers/notificationReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  cars: carReducer,
  notification: notificationReducer,
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;