import { Link, useLocation } from "react-router";
import { cn } from "../app/lib/utils";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";

const Header = ({ title, description, ctaText, ctaUrl }: HeaderProps) => {
  const path = useLocation();

  return (
    <header className="header">
      <article>
        <h1
          className={cn(
            "text-dark-100",
            path.pathname === "/"
              ? "text-4xl font-bold md:text-2xl"
              : "text-2xl font font-semibold md:text-xl"
          )}
        >
          {title}
        </h1>
        <p
          className={cn(
            "text-gray-100 font-normal",
            path.pathname === "/"
              ? "text-4xl font-base md:text-lg"
              : "text-sm  md:text-lg"
          )}
        >
          {description}
        </p>
      </article>
      {ctaText && ctaUrl && (
        <Link to={ctaUrl}>
          <ButtonComponent
            type="button"
            className="button-class !h-full !w-full md:w-[250px]"
          >
            <img src="/assets/icons/plus.svg" alt="plus" className="size-5" />
            <span className="p-16-semibold text-white">{ctaText}</span>
          </ButtonComponent>
        </Link>
      )}
    </header>
  );
};

export default Header;
