// User interface
// Entry file
// gets data from UI and delegate actions to the other modules
/* eslint-disable */
// make some of the new JS feats work in all the browsers
// these js files can get data only from the pug templates
// (document.get().. or parameters that were sent from the template)
import '@babel/polyfill';

import { login, signUp, logout, forgotPassword, resetPassword, confirmEmail } from './login';

import { displayMap } from './mapbox';

import { createReview } from './createReview';

import { updateSettings } from './updateSettings'

import { bookTour } from './stripe';

import { sendNotification, verifyOtp } from './VerifySms';

// DOM ELEMENTS 
const mapBox = document.getElementById('map');

const loginForm = document.querySelector('.form--login');
const signUpForm = document.querySelector('.form--signup');
const reviewForm = document.querySelector('.form--review');

const forgotPasswordForm = document.querySelector('.form--forgot');
const resetPasswordForm = document.querySelector('.form--reset');

const insertPhoneForm = document.querySelector('.form--insertPhone');
const insertVerificationCode = document.querySelector('.form--insertPhone');

const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

const confirmBtn = document.querySelector('.nav__el--con');
const logOutBtn = document.querySelector('.nav__el--logout');
const bookBtn = document.getElementById('book-tour');

// const phoneForm = document.getElementById('phone-form');
// const verifyForm = document.getElementById('verify-form');
// const responseText = document.getElementById('response-text');

// let phoneNumber;
// if (phoneForm){
//   phoneForm.addEventListener('submit', async e => {
//     e.preventDefault();

//     phoneNumber = document.getElementById('phone-number-input').value;

//     sendNotification(phoneNumber);
//   });
// }

// if (verifyForm){
//   verifyForm.addEventListener('submit', async e => {
//     e.preventDefault();

//     const otp = document.getElementById('otp-input').value;

//     const data = {
//       phoneNumber: phoneNumber, 
//       otp: otp
//     };
//     verifyOtp(phoneNumber, otp)
//   });
// }

// DELEGATION
if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
  }

// If there's a login form
if (loginForm) {
  loginForm.addEventListener('submit', e => {
  // when a form is submitted, we want to prevent
  // it from reloading the page...
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if(signUpForm) {
  signUpForm.addEventListener('submit', e => {
      e.preventDefault();
      let name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const passwordConfirm = document.getElementById('passwordConfirm').value; 
      signUp(name, email, password, passwordConfirm);
    });
} 

if(reviewForm) {
  reviewForm.addEventListener('submit', e => {
      e.preventDefault();
      // Tour id was saved on the element
      const { tourId } = e.target.dataset;
      const review = document.getElementById('review').value; 
      const rating = document.getElementById('rating').value; 
      createReview(review, rating, tourId);
  });
} 

if(confirmBtn) {
  confirmBtn.addEventListener('click', confirmEmail);
};

if(logOutBtn) {
  logOutBtn.addEventListener('click', logout);
};

if(forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;  
    forgotPassword(email);   
  });
}

if(resetPasswordForm) {
 resetPasswordForm.addEventListener('submit', e => {
  e.preventDefault();
  const password = document.getElementById('password').value; 
  const passwordConfirm = document.getElementById('passwordConfirm').value; 
  resetPassword(password, passwordConfirm);   
});
}

if(insertPhoneForm) {
  console.log('insert phone')
  insertPhoneForm.addEventListener('submit', e => {
   e.preventDefault();
   const phoneNumber = document.getElementById('tel').value; 
   getPhoneNumber(phoneNumber);
 });
 }

 if(insertVerificationCode) {
  console.log('insert code')
  insertVerificationCode.addEventListener('submit', e => {
   e.preventDefault();
   const code = document.getElementById('code').value; 
   checkCode(code);
 });
 }

// If theres an user update form
if (userDataForm) {
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    // formData constructs a set of key-value pairs,
    // with the format of multi-part/form-data,
    // this way it will be able to encode files
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    // const name = document.getElementById('name').value;
    // const email = document.getElementById('email').value;
    updateSettings(form, 'data');
  });
}

// password form displayed
if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';
  
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    // every async function returns a promise
    await updateSettings({ passwordCurrent, password, passwordConfirm }, 'password');
    
    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  }); 
}

if (bookBtn) {
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    // taking param tourId from the pug template
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}