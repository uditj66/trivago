import { Outlet, redirect } from "react-router";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { NavItems, Mobilesidebar } from "components";
import { account } from "~/appwrite/client";
import { getExistingUser, storeUserData } from "~/appwrite/authrelated";

export async function clientLoader() {
  try {
    // getting userId of logged-in user
    const user = await account.get();
    /* TESTING 
     console.log(user);
      console.log(user.$id);
      const providerAccessToken=await account.getSession("current");
      console.log(providerAccessToken);
     */

    // If user is not logged-in redirect to /sign-in
    if (!user.$id) return redirect("/sign-in");

    // Checking if user is an existing user by passing the id of currently logged-in User
    const existingUser = await getExistingUser(user.$id);
    if (existingUser?.status === "user") {
      return redirect("/");
    }
    // If user is not an existing user then store its info in the database

    return existingUser?.$id ? existingUser : await storeUserData();
  } catch (error) {
    console.error("Error in client loader:", error);
    return redirect("/sign-in");
  }
}
const adminLayout = () => {
  return (
    <div className="admin-layout">
      <Mobilesidebar />
      <aside className="w-full max-w-[270px] hidden lg:block">
        <SidebarComponent width={270} enableGestures={false}>
          <NavItems />
        </SidebarComponent>
      </aside>

      {/* Below code alows us to 
      1.It tells React Router where to render the child routes inside the parent route's layout/component.

      2. It allows you to create nested routes with a shared layout.
      
      How it works in your code?
      1.The <main> element with class "children" acts as a container or section for page content.

      2.The <Outlet /> inside <main> means the content of the matched child route will be rendered here dynamically.
      

      */}
      <main className="children">
        <Outlet />
      </main>
    </div>
  );
};

export default adminLayout;
