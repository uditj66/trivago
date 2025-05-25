import { Outlet } from "react-router";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { NavItems } from "components";
import Mobilesidebar from "components/Mobilesidebar";
const adminLayout = () => {
  return (
    <div className="admin-layout">
      <Mobilesidebar />
      <aside className="w-full max-w-[270px] hidden lg:block">
        <SidebarComponent width={270} enableGestures={true}>
          <NavItems />
        </SidebarComponent>
      </aside>
      <main className="children">
        <Outlet />
      </main>
    </div>
  );
};

export default adminLayout;
