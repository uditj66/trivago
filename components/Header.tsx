import { useLocation } from "react-router";
import { cn } from "../app/lib/utils";

const Header = ({ title, description }: HeaderProps) => {
  const location = useLocation();
  return (
    <header className="header">
      <article>
        <h1
          className={cn(
            "text-dark-100",
            location.pathname === "/"
              ? "text-4xl font-bold md:text-2xl"
              : "text-2xl font font-semibold md:text-xl"
          )}
        >
          {title}
        </h1>
        <p
          className={cn(
            "text-gray-100 font-normal",
            location.pathname === "/"
              ? "text-4xl font-base md:text-lg"
              : "text-sm  md:text-lg"
          )}
        >
          {description}
        </p>
      </article>
    </header>
  );
};

export default Header;
