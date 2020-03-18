import http from './httpService';
import { apiUrl } from '../config.json';

const apiEndpoint = apiUrl + '/api-token-auth/';
const tokenKey = 'token';
const userKey = 'user';
const userIdKey = 'id';
const userIsAdminKey = 'admin';
const userNombre = 'nombre';

http.setAuthToken(getToken());

export async function login(username, password) {
  const { data: user } = await http.post(apiEndpoint, { username, password });
  localStorage.setItem(tokenKey, user['auth_token']);
  localStorage.setItem(userKey, user['username']);
  localStorage.setItem(userIdKey, user['id']);
  localStorage.setItem(userIsAdminKey, user['is_staff']);
  localStorage.setItem(userNombre, user['nombre']);
  return user;
}

export async function changePassword(password) {
  // console.log(password);
  const apiEndpointPass = apiUrl + '/change_password/';
  const { data: user } = await http.post(apiEndpointPass, { password });
}

export function loginSave(user) {
  //console.log('esto llega', user);
  localStorage.setItem(tokenKey, user['auth_token']);
  localStorage.setItem(userKey, user['username']);
  localStorage.setItem(userIsAdminKey, user['is_staff']);
  localStorage.setItem(userNombre, user['nombre']);
  localStorage.setItem(userIdKey, user['id']);
}

export function logout() {
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(userKey);
  localStorage.removeItem(userIsAdminKey);
  localStorage.removeItem(userIdKey);
  localStorage.removeItem(userNombre);

  return true;
}

export function getCurrentUser() {
  try {
    var user = {
      name: localStorage.getItem(userKey),
      nombre: localStorage.getItem(userNombre),
      id: localStorage.getItem(userIdKey)
    };
    if (user.name == null) {
      return null;
    }
    return user;
  } catch (ex) {
    return null;
  }
}

export function getIsAdmin() {
  try {
    const isAdmin = localStorage.getItem(userIsAdminKey);
    if (isAdmin === 'true') {
      return true;
    }
  } catch (ex) {
    return null;
  }
}

export function getToken() {
  try {
    const token = localStorage.getItem(tokenKey);
    return token;
  } catch (ex) {
    return null;
  }
}

export default {
  login,
  loginSave,
  changePassword,
  logout,
  getCurrentUser,
  getIsAdmin
};
