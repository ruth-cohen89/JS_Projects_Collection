/* eslint-disable */
// axios is for makeing HTTP requests from node.js
import axios from 'axios';
import { showAlert } from './alerts'

export const getPhoneNumber = async (number) => {
  console.log('pop',number)
    try {
      const res = await axios({
        method: 'POST',
        url: 'http://127.0.0.1:8000/api/v1/users/stepOnePhoneVer',
        data: { 
          number,
        }
      });
      console.log(res,'jgg')
      if(res.data.status === 'success') {
        //showAlert('success', 'We sent your phone a verification number');
        const id = res.data.id;
        window.setTimeout(() => {
        // Moving to step 2
        location.assign(`/stepTwo/${id}`)
        }, 2500);
  
      }
    
      } catch (err) {
        //The error response from the API
        showAlert('error', err);
      }
  };
  
  export const checkCode = async (token) => {
    console.log(token)
      try {
        const res = await axios({
          method: 'POST',
          url: 'http://127.0.0.1:8000/api/v1/users/stepTwoPhoneVer',
          data: { 
            token,
          }
        });
        
        if(res.data.status === 'success') {
          showAlert('success', res.data.message);
          // window.setTimeout(() => {
          // // Moving to step 2
          // location.assign(`/stepTwo/${id}`)
          // }, 2500);
    
        }
      
        } catch (err) {
          //The error response from the API
          showAlert('error', err);
        }
    };