// /* eslint-disable */
// // axios is for makeing HTTP requests from node.js
// import axios from 'axios';
// import { showAlert } from './alerts'

// export const sendNotification = async (phoneNumber) => {
//     try {
//       const res = await axios({
//         method: 'POST',
//         url: 'api/v1/users/send-notification',
//         headers: { 'Content-Type': 'application/json' }, //??
//         data: {
//           phoneNumber,
//         }
//       });
//       if(res.data.status === 'success') {
//         showAlert('success', 'We sent your phone a verification number');
//         phoneForm.style.display = 'none';
//         verifyForm.style.display = 'block';
//         //const id = res.data.id;
//         // window.setTimeout(() => {
//         // // Moving to step 2
//         // location.assign(`/stepTwo/${id}`)
//         // }, 2500);
  
//       }
    
//       } catch (err) {
//         showAlert('error', err);
//       }
//   };
  
//   export const verifyOtp = async (phoneNumber, otp) => {
//     try {
//       const res = await axios({
//         method: 'POST',
//         url: 'api/v1/users/verify-otp',
//         headers: { 'Content-Type': 'application/json', 'Accept': 'application/json'}, //??
//         data: {
//           phoneNumber, otp,
//         }
//       });

//       const check = await response.json();

//       const text = response.ok ? check.status : response.statusText;
//       responseText.innerHTML = text;

//       verifyForm.style.display = 'none';
//       responseText.style.display = 'block';  

//       if(res.data.status === 'success') {
//         showAlert('success', 'We sent your phone a verification number');
//         phoneForm.style.display = 'none';
//         verifyForm.style.display = 'block';
//         //const id = res.data.id;
//         // window.setTimeout(() => {
//         // // Moving to step 2
//         // location.assign(`/stepTwo/${id}`)
//         // }, 2500);
  
//       }
    
//       } catch (err) {
//         showAlert('error', err);
//       }
//   };