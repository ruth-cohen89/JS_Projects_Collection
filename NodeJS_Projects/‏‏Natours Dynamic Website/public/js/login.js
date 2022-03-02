/* eslint-disable */

const login = async (email, password) => {
  //axios throws errors when there are
  // so we catch them in the block
  try {
  //This req is routed to the API, to the user router
  const res = await axios({
    method: 'POST',
    url: 'http://127.0.0.1:8000/api/v1/users/login',
    data: {
      email: email,
      password: password,
    }
  });
  console.log(res);      
  } catch (err) {
      //The error response from the API
      console.log(err.response.data)
  }


}

document.querySelector('.form').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  console.log(email, password)
  login(email, password);
});
