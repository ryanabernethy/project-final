import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    USER_LOADED_SUCCESS,
    USER_LOADED_FAIL,
    AUTHENTICATED_SUCCESS,
    AUTHENTICATED_FAIL,
    SIGNUP_SUCCESS,
    SIGNUP_FAIL,
    NOTIFICATION_RETRIEVED_SUCCESS,
    NOTIFICATION_CHANGE,
    BOOKING_CHANGE,
    LOGOUT,
} from '../actions/types';

const initialState = {
    access: localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh'),
    isAuthenticated: null,
    user: null,
    registered: null,
    loggedin: null,
    notification: null,
    notificationChangedId: 0,
    bookingChangedId: 0,
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case AUTHENTICATED_SUCCESS: 
            return {
                ...state,
                isAuthenticated: true
            }
        case LOGIN_SUCCESS:
            localStorage.setItem('access', payload.access);
            localStorage.setItem('refresh', payload.refresh);
            return {
                ...state,
                isAuthenticated: true,
                access: payload.access,
                refresh: payload.refresh,
                loggedin: true 
            }
        case SIGNUP_SUCCESS:
            return {
                ...state,
                isAuthenticated: false,
                registered: true
            }
        case USER_LOADED_SUCCESS:
            return {
                ...state,
                user: payload
            }
        case AUTHENTICATED_FAIL: 
            return {
                ...state,
                isAuthenticated: false
            }
        case USER_LOADED_FAIL:
            return {
                ...state,
                user: null 
            }
        case LOGIN_FAIL:
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            return {
                ...state,
                access: null,
                refresh: null,
                isAuthenticated: false,
                user: null,
                loggedin: false 
            }
        case SIGNUP_FAIL:
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            return {
                ...state,
                access: null,
                refresh: null,
                isAuthenticated: false,
                user: null,
                registered: false
            }
        case LOGOUT:
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            return {
                ...state,
                access: null,
                refresh: null,
                isAuthenticated: false,
                user: null,
                registered: null,
                loggedin: null,
            }
        case NOTIFICATION_RETRIEVED_SUCCESS:
            return {
                ...state,
                notification: payload
            }
        case NOTIFICATION_CHANGE:
            return {
                ...state,
                notificationChangedId: payload
            }
        case BOOKING_CHANGE:
            return {
                ...state,
                bookingChangedId: payload
            }
        default:
            return state 
    }
}