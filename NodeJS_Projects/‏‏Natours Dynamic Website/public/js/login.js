/* eslint-disable */
import axios from 'axios';
import { showAlert, hideAlert } from './alerts'

export const login = async (email, password) => {
  //axios throws errors when there are
  // so we catch them in the block

  try {
  //The request is routed to the API, to the user router
  // axios is for making HTTP request for the browser
  // Instead of using fetch API....
  // (until now we made reqs from postman/ had only GET req by entering a URL
  // but with axios we can perform all browser reqs :) )
  
  const res = await axios({
    method: 'POST',
    url: 'http://127.0.0.1:8000/api/v1/users/login',
    data: { 
      email,
      password,
    }
  });
  
  if(res.data.status === 'success') {
    showAlert('success', 'Logged in successfuly!');
    window.setTimeout(() => {
      //back to homepage
      location.assign('/')
    }, 1500);
  }

  } catch (err) {
      //The error response from the API
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try { 
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/v1/users/logout',
    });
    // reload page and send new cookie
    // location represents the current URL of the doc in the window
    if(res.data.status = 'success') location.reload(true);
  } catch(err) {
    showAlert('error', 'Error logging out! Try again.')
  }
}

