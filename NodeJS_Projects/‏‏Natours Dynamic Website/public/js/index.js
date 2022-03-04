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

// console.log('hi from index!')

// DELEGATION
if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
  }

if (loginForm) {
  loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  login(email, password);
  });
}
