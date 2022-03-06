//Entry file
// gets data from UI and delegate actions to the other modules
/* eslint-disable */
//make some of the new JS feats work in all the browsers
import '@babel/polyfill';

import { login, logout } from './login';

import { displayMap } from './mapbox';
// DOM ELEMENTS 
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');
const logOutBtn = document.querySelector('.nav__el--logout');
// console.log('hi from index!')

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