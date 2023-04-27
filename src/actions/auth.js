import axios from 'axios';
import { API_URL } from '../constants';
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
} from './types';

export const load_user = () => async dispatch => {
    if(localStorage.getItem('access')) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };

        try {
            const res = await axios.get(`${API_URL}/auth/users/me/`, config);
        
            dispatch({
                type: USER_LOADED_SUCCESS,
                payload: res.data 
            });
        } catch(err) {
            dispatch({
                type: USER_LOADED_FAIL
            });
        }
    } else {
        dispatch({
            type: USER_LOADED_FAIL
        });
    }
};

export const checkAuthenticated = () => async dispatch => {
    if(localStorage.getItem('access')) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        const body = JSON.stringify({ token: localStorage.getItem('access') });
    
        try {
            const res = await axios.post(`${API_URL}/auth/jwt/verify/`, body, config);
        
            if(res.data.code !== 'token_not_valid') {
                dispatch({
                    type: AUTHENTICATED_SUCCESS
                });
            } else {
                dispatch({
                    type: AUTHENTICATED_FAIL
                });
            }
        } catch(err) {
            dispatch({
                type: AUTHENTICATED_FAIL
            });
        }
    } else {
        dispatch({
            type: AUTHENTICATED_FAIL
        })
    }
};

export const login = (email, password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ email, password });

    try {
        const res = await axios.post(`${API_URL}/auth/jwt/create/`, body, config);
    
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data 
        });

        dispatch(load_user());
    } catch(err) {
        dispatch({
            type: LOGIN_FAIL
        });
    }
};

export const signup = (identifying_number, first_name, last_name, email, birth_date, gender, is_patient, password, re_password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ identifying_number, email, first_name, last_name, birth_date, gender, is_patient, password, re_password });

    try {
        const res = await axios.post(`${API_URL}/auth/users/`, body, config);
    
        dispatch({
            type: SIGNUP_SUCCESS,
            payload: res.data 
        });
    } catch(err) {
        dispatch({
            type: SIGNUP_FAIL
        });
    }
};

export const logout = () => dispatch => {
    dispatch({
        type: LOGOUT
    });
};

export const retrieve_notifications = (email) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ email });

    try {
        const res = await axios.post(`${API_URL}/api/notifications/`, body, config);
        
        dispatch({
            type: NOTIFICATION_RETRIEVED_SUCCESS,
            payload: res.data 
        });
    } catch(err) {
        
    }
};

export const load_notification = (uid) => async dispatch => {
    dispatch({
        type: NOTIFICATION_CHANGE,
        payload: uid
    });
};

export const load_booking = (uid) => async dispatch => {
    dispatch({
        type: BOOKING_CHANGE,
        payload: uid
    });
};