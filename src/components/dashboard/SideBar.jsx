export default function SideBar({ children, footer }) {
  {
    ("Absolute path /logo.png will map to public/logo.png, allows all pages retrieve the logo");
  }
  {
    ("Absolute paths tell the browser exactly where to find something, starting from a fixed point (like the root of the site or file system, rather than starting from the current folder or current URL");
  }
  return (
    <div className="relative w-4/5 md:w-1/3 lg:w-1/5 xl:w-1/5 bg-bar h-screen flex flex-col items-center shadow-xl gap-2 animate-fade-right">
      <img className="m-3" src="/logo.png" alt="" /> {children}
      <p className="absolute bottom-5 font-vietnam font-light text-text-secondary">
        {footer}
      </p>
    </div>
  );
}
