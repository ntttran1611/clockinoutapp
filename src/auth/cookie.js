import Cookies from "js-cookie";

export function setAccessCookie(data) {
  Cookies.set("access_token", data.session.access_token);
}

export function setRefreshCookie(data) {
  Cookies.set("refresh_token", data.session.refresh_token);
}

export function getCookie(name) {
  Cookies.get(name);
}

export function removeCookie(name) {
  Cookies.remove(name);
}
