export function LoadingSpinner({ isFullScreen, size="xl" }) {
  return (
    <div
      className={`${isFullScreen ? "h-screen" : ""} flex items-center justify-center`}
    >
      <span className={`loading loading-spinner loading-${size}`}></span>
    </div>
  );
}
