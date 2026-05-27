export function formatID(id) {
  return String(id).padStart(6, "0");
}

export function getEmailWithoutPrefix(emailStr){
  return emailStr.substring(0, emailStr.indexOf('@'));
}
