export function LoadingSpinner({ isFullScreen }) {
  return (
    <div
      className={`${isFullScreen ? "h-screen" : ""} flex items-center justify-center`}
    >
      <span className="loading loading-spinner loading-xl"></span>
    </div>
  );
}
