const initialState = {
  cars: [],
  selectedCar: null,
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
};

export default function carReducer(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_CARS_REQUEST':
    case 'FETCH_CAR_DETAILS_REQUEST':
    case 'ADD_CAR_REQUEST':
    case 'UPDATE_CAR_REQUEST':
    case 'DELETE_CAR_REQUEST':
      return { ...state, loading: true, error: null };
    case 'FETCH_CARS_SUCCESS':
      return {
        ...state,
        loading: false,
        cars: action.payload.docs,
        totalPages: action.payload.totalPages,
        currentPage: action.payload.page,
      };
    case 'FETCH_CAR_DETAILS_SUCCESS':
      return { ...state, loading: false, selectedCar: action.payload };
      case 'ADD_CAR_SUCCESS':
        return { ...state, loading: false, cars: [...state.cars, action.payload] };
      case 'UPDATE_CAR_SUCCESS':
        return {
          ...state,
          loading: false,
          cars: state.cars.map(car => 
            car._id === action.payload._id ? action.payload : car
          ),
          selectedCar: action.payload,
        };
      case 'DELETE_CAR_SUCCESS':
        return {
          ...state,
          loading: false,
          cars: state.cars.filter(car => car._id !== action.payload),
          selectedCar: null,
        };
      case 'FETCH_CARS_FAILURE':
      case 'FETCH_CAR_DETAILS_FAILURE':
      case 'ADD_CAR_FAILURE':
      case 'UPDATE_CAR_FAILURE':
      case 'DELETE_CAR_FAILURE':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  }
  