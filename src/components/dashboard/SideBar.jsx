export default function SideBar({ children, footer }) {
  return (
    <div className="relative min-w-85 px-10 bg-bar h-screen flex flex-col items-center shadow-xl gap-2 animate-fade-right">
      <img className="m-3" src="logo.png" alt="" />
      {children}
      <p className="absolute bottom-5 font-vietnam font-light text-text-secondary">
        {footer}
      </p>
    </div>
  );
}
