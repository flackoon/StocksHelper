import * as actionTypes from '../constants/LayoutActionTypes';
import { USER_LOGGED_IN, USER_LOGGED_OUT } from '../constants/AccountActionTypes';
import authService from '../services/AuthService';
import notifications from '../infrastructure/notifications';

const initialState = {
  isOpened: false,
  isAuthorized: authService.isAuthorized()
}

export default function layout(state = initialState, action) {
  switch (action.type) {
    case actionTypes.NAVBAR_TOGGLED: {
      return {
        ...state,
        isOpened: !state.isOpened
      };
    }
    case USER_LOGGED_IN: {
      return {
        ...state,
        isAuthorized: true
      }
    }
    case USER_LOGGED_OUT: {
      return {
        ...state,
        isAuthorized: false
      }
    }
    case actionTypes.APP_ERROR: {
      notifications.error(action.message);
      return state;
    }
    default:
      return state;
  }
}