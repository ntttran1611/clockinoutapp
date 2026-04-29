export default function FormErrorMessage({ message }) {
  if (message.length == 0) {
    return;
  }
  return <p className="text-alert italic text-xs">Error: {message}</p>;
}
