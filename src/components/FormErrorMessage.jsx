export function FormErrorMessage({ message }) {
  if (message.length == 0) {
    return;
  }
  return <p className="text-alert italic text-xs">Error: {message}</p>;
}

export function FormMessage({ message }) {
  if (message.length == 0) {
    return;
  }
  return <p className="text-mocha italic text-xs">Message: {message}</p>;
}
