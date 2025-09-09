import React from "react";
import { useNavigate } from "react-router";
import { logoutUser } from "~/appwrite/authrelated";

const pagelayout = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logoutUser();
    navigate("/sign-in");
  };
  return (
    <div>
      <button className="cursor-pointer" onClick={handleLogout}>
        <img
          src={"/assets/icons/logout.svg"}
          alt="logout"
          width={6}
          height={6}
        />
      </button>
      <button className="cursor-pointer" onClick={() => navigate("/dashboard")}>Dashboard</button>
    </div>
  );
};

export default pagelayout;
