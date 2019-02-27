const setItem = (key, val) => {
  return localStorage.setItem(key, val);
};

const getItem = key => {
  return localStorage.getItem(key);
};

const rmItem = key => {
  return localStorage.removeItem(key);
};

const getBaseUrl = () => {
  return '/api';
};

export { setItem, getItem, rmItem, getBaseUrl };
