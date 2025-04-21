/* eslint-disable */
import { login, logout } from './login';
import { displayMap } from './mapbox';

const loginForm = document.querySelector('.form');
const map = document.querySelector('#map');
const logoutBtn = document.querySelector('.nav__el--logout');

if (map) {
  const locations = JSON.parse(map.dataset.locations);

  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    login(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}
