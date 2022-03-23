/* eslint-disable */
// axios is for makeing HTTP requests from node.js
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
    url: '/api/v1/users/login',
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

export const signUp = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: { 
        email,
        password,
        passwordConfirm,
        name,
      }
    });
    
    if(res.data.status === 'success') {
      showAlert('success', 'We sent you a confimiration email');
    }
  
    } catch (err) {
      //The error response from the API
      showAlert('error', err.response.data.message);
    }
};

export const confirmEmail = async () => {
  try {
    const token = location.href.split('/')[4];
    const url = `/api/v1/users/emailConfirm/${token}`;

    const res = await axios({
      method: 'POST',
      url,
    });
    
    if(res.data.status === 'success') {
      showAlert('success', 'Your email address has been confirmed!');
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
      url: '/api/v1/users/logout',
    });
    // reload page and send new cookie
    // location represents the current URL of the doc in the window

    if(res.data.status = 'success') location.reload(true);
  } catch(err) {
    showAlert('error', 'Error logging out! Try again.')
  }
}

export const forgotPassword = async (email) => {
  try { 
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotPassword',
      data: { 
        email,
      }
    });

    if(res.data.status = 'success') {
      showAlert('success', 'Reset email sent!');
    }

  } catch(err) {
    showAlert('error', err.response.data.message);
  }
};

export const resetPassword = async (password, passwordConfirm) => {
  try { 
    const token = location.href.split('/')[4];
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/resetPassword/${token}`,
      data: { 
        password,
        passwordConfirm,
      }
   });
    if(res.data.status = 'success') {
      showAlert('success', 'password has changed 😊');
      window.setTimeout(() => {
        //back to homepage
        location.assign('/')
      }, 1000);
    }
    //location.reload(true);
  } catch(err) {
    showAlert('error', err.response.data.message);
  }
};