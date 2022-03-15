/* eslint-disable */
// class for alerts, replaces the use of default js 'alert' class
// For errors inside the rendered page
export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
}

// type = success/error
export const showAlert = (type, msg) => {
  // hide other alerts
  hideAlert();

  const markup = `<div class="alert alert--${type}">${msg}</div>`;

  // right at the begining of the body
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};