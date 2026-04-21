import { Link } from "react-router-dom";
import { forwardRef } from "react";

const TabLink = forwardRef(
  ({ id, to, onClick, icon: Icon, label, tabOrder }, ref) => {
    return (
      <Link
        ref={ref}
        id={id}
        to={to}
        onClick={onClick}
        className={`flex w-full items-center justify gap-2 px-5 py-3 ${id === tabOrder ? "font-medium text-white" : "text-text-primary"} `}
      >
        {Icon && <Icon className="h-5 w-5" />}
        <p>{label}</p>
      </Link>
    );
  },
);

TabLink.displayName = "TabLink";

export default TabLink;
