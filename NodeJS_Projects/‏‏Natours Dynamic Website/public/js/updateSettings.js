/* eslint-disable */
import axios from 'axios';
import { showAlert, hideAlert } from './alerts'

// type is either password or 'data' - email & name
export const updateSettings = async (data, type) => {
  try {
    const url = type === 'password' ? 'http://127.0.0.1:8000/api/v1/users/updateMyPassword'
     : 'http://127.0.0.1:8000/api/v1/users/updateMe'
    const res = await axios({
    method: 'PATCH',
    url,
    data,
  });

  if (res.data.status === 'success') {
    showAlert('success', `${type.toUpperCase()} updated successfuly!`);
  }
  } catch (err) {
    //The error response from the API
    showAlert('error', err.response.data.message);
  }
};