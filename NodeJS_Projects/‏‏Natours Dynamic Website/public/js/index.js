// User interface
// Entry file
// gets data from UI and delegate actions to the other modules
/* eslint-disable */
//make some of the new JS feats work in all the browsers
import '@babel/polyfill';

import { login, logout } from './login';

import { displayMap } from './mapbox';

import { updateSettings } from './updateSettings'

// DOM ELEMENTS 
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

// DELEGATION
if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
  }

// If there's a form
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

// If there's a logout btn
if(logOutBtn) {
  logOutBtn.addEventListener('click', logout);
};

// If theres an update
if (userDataForm) {
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    updateSettings({ name, email }, 'data');
  });
}

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