// @ts-nocheck
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { Link } from "react-router";
import NavItems from "./NavItems";
import { useRef } from "react";

const Mobilesidebar = () => {
  const sidebarRef = useRef<SidebarComponent>(null);
  const toogleSidebar = () => {
    sidebarRef.current.toggle();
  };
  return (
    <div className="mobile-sidebar wrapper">
      <header>
        <Link to={"/"}>
          <img
            src="/assets/icons/logo.svg"
            alt="logo"
            className="size-[60px]"
          />
          <h1>TriVago</h1>
        </Link>

        <button className="cursor-pointer" onClick={toogleSidebar}>
          <img src="/assets/icons/menu.svg" alt="menu" className="size-10" />
        </button>
      </header>
      <SidebarComponent
        width={270}
        ref={sidebarRef}
        // after the sidebar is created we want to hide it
        created={() => sidebarRef.current.hide()}
        // on clicking outside the side-bar we want to close the sidebar
        closeOnDocumentClick={true}
        // shows us a difference in  background
        showBackdrop={true}
        type="over"
      >
        <NavItems handleClick={toogleSidebar} />
      </SidebarComponent>
    </div>
  );
};

export default Mobilesidebar;
