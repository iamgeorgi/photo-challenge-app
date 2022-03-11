export const getToken = () => {
  return sessionStorage.getItem('token') || null;
}

export const setToken = (token) => {
  return sessionStorage.setItem('token', token);
}

export const removeToken = () => {
  return sessionStorage.removeItem('token');
}
