/* eslint-disable */
// axios is for makeing HTTP requests from node.js
import axios from 'axios';
import { showAlert, hideAlert } from './alerts'

export const createReview = async (review, rating, tourId) => {

  try {
  const res = await axios({
    method: 'POST',
    url: `http://127.0.0.1:8000/api/v1/tours/${tourId}/reviews`,
    data: { 
      review,
      rating,
    }
  });
  
  if(res.data.status === 'success') {
    showAlert('success', 'Thank you for reviewing :)');
    // window.setTimeout(() => {
    //   location.assign('/')
    // }, 1500);
  }

  } catch (err) {
    //The error response from the API
    showAlert('error', 'You have already reviewed this tour!');
  }
};
