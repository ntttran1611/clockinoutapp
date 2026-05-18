// localStorage implementation for user and token storage

export function setAccessTokenToStorage(data) {
  localStorage.setItem("access_token", data.session.access_token);
}

export function setRefreshTokenToStorage(data) {
  localStorage.setItem("refresh_token", data.session.refresh_token);
}

export function getItemFromStorage(name) {
  return localStorage.getItem(name);
}

export function setAccountToStorage(data) {
  localStorage.setItem("user", JSON.stringify(data));
}

export function removeFromStorage(name) {
  localStorage.removeItem(name);
}
