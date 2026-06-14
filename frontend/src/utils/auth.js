export const getToken = () =>
  localStorage.getItem("token");

export const getRole = () =>
  localStorage.getItem("role");

export const getUsername = () =>
  localStorage.getItem("username");

export const isAuthenticated =
  () => !!getToken();