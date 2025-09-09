import { Link, NavLink, useLoaderData, useNavigate } from "react-router";
import { sidebarItems } from "~/constants";
import { cn } from "../app/lib/utils";
import { logoutUser } from "~/appwrite/authrelated";
const NavItems = ({ handleClick }: { handleClick?: () => void }) => {
  
  const user = useLoaderData();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logoutUser();
    navigate("/sign-in");
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
        <h1>TriVago</h1>
      </Link>

      <div className="container">
        <nav>
          {sidebarItems.map(({ id, href, label, icon }) => (
            <NavLink key={id} to={href}>
              {/* we get isActive prop with NavLink by default */}
              {({ isActive }: { isActive: boolean }) => (
                <div
                  onClick={handleClick}
                  className={cn("group nav-item", {
                    "bg-primary-100 !text-white": isActive,
                  })}
                >
                  <img
                    src={icon}
                    alt={label}
                    className={`group-hover:brightness-0 size-5 group-hover:invert ${
                      isActive ? "brightness-0 invert" : "text-dark-200"
                    }`}
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
            alt={`${user?.name}`||"user"}
          />
          <article className="">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </article>

          <button className="cursor-pointer" onClick={handleLogout}>
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
