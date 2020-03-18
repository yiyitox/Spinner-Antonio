import axios from 'axios';
axios.defaults.timeout = 15000;

axios.interceptors.response.use(null, error => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    console.log(error);
  }
  return Promise.reject(error.response);
});

function setAuthToken(token) {
  if (token) {
    axios.defaults.headers.common['Authorization'] = 'Token ' + token;
  } else {
    //console.log("no token");
  }
}

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  patch: axios.patch,
  delete: axios.delete,
  setAuthToken
};
