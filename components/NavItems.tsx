
import { Link, NavLink } from "react-router";
import { sidebarItems } from "~/constants";
import { cn } from "../app/lib/utils";
const NavItems = ({ handleClick }: { handleClick?: () => void }) => {
  const user = {
    name: "Udit jain",
    email: "uditj66@gmail.com",
    imageUrl: "/assets/images/david.webp",
  };
  return (
    <section className="nav-items">
      <Link to={"/"} className="link-logo">
        <img
          src="/assets/icons/logo.svg"
          alt="logo"
          width={60}
          height={60}
          // or
          className="size-[60px]"
        />
        <h1>TravInVac</h1>
      </Link>

      <div className="container">
        <nav>
          {sidebarItems.map(({ id, href, label, icon }) => (
            <NavLink key={id} to={href}>
              {({ isActive }: { isActive: boolean }) => (
                <div onClick={handleClick}
                  className={cn("group nav-items", {
                    "bg-primary-100 !text-white": isActive,
                  })}
                >
                  <img
                    src={icon}
                    alt={label}
                    className={cn(
                      "group-hover:brightness-0 size-5 group-hover:invert",
                      isActive && "brightness-0 invert"
                    )}
                  />
                  {label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>
        <footer className="nav-footer">
          <img
            src={user?.imageUrl || "/assets/images/david.webp"}
            alt="username || david"
          />
          <article className="">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </article>

          <button
            className="cursor-pointer"
            onClick={() => console.log("logout")}
          >
            <img
              src={"/assets/icons/logout.svg"}
              alt="logout"
              width={6}
              height={6}
            />
          </button>
        </footer>
      </div>
    </section>
  );
};

export default NavItems;
