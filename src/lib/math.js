const LENGTHID = 6;
export default function generateId() {
  let id = "";
  for (var i = 0; i < LENGTHID; i++) {
    const digit = Math.floor(Math.random() * 10);
    id += digit.toString();
  }
  return id;
}
