const LENGTHID = 6;
export function generateId() {
  let id = "";
  for (var i = 0; i < LENGTHID; i++) {
    const digit = Math.floor(Math.random() * 10);
    id += digit.toString();
  }
  return id;
}

export function formatDecimal(decimal, decimalPlace) {
  if (decimalPlace) {
    return decimal.toFixed(decimalPlace);
  }

  return decimal.toFixed(2);
}
