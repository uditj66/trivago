// @ts-nocheck
import { Sidebar, SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { Link } from "react-router";
import NavItems from "./NavItems";

const Mobilesidebar = () => {
  let sidebar: SidebarComponent;
  const toogleSidebar = () => {
    sidebar.toggle();
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
          <h1>TravInVac</h1>
        </Link>

        <button className="cursor-pointer" onClick={toogleSidebar}>
          <img src="/assets/icons/menu.svg" alt="menu" className="size-10" />
        </button>
      </header>
      <SidebarComponent
        width={270}
        ref={(Sidebar) => (sidebar = Sidebar)}
        // after the sidebar is created we want to hide it
        created={() => sidebar.hide()}
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
