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

export function clearAuthCookies() {
  document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  document.cookie = "sb-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
};

export function setCookie(session, cookieType = 'access') {
  if(cookieType === 'access') {
    document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=${25 * 60}; SameSite=Lax; Secure`;
  } else if(cookieType === 'refresh'){
    document.cookie = `sb-refresh-token=${session.refresh_token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax; Secure`;
  }
} 