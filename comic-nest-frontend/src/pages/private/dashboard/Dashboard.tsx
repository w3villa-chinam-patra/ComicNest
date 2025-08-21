import { Outlet } from "react-router-dom";
import SideBar from "./Sidebar";
import { ComicBackgroundWrapper, Loader } from "../../../components";
import { useAuth } from "../../../contexts/AuthContext";
import { NextAction } from "../../../types";
import NextActionSteps from "../next-action-steps/NextActionSteps";

const Dashboard = () => {
  const { user } = useAuth();
  if (!user || !user?.nextAction) {
    return (
      <ComicBackgroundWrapper>
        <div className="flex justify-center items-center h-full w-full">
          <Loader />
        </div>
      </ComicBackgroundWrapper>
    );
  }
  if (user?.nextAction !== NextAction.NONE) {
    return (
      <ComicBackgroundWrapper>
        <NextActionSteps />
      </ComicBackgroundWrapper>
    );
  }
  return (
    <div className="grid grid-cols-[20rem_1fr] w-full">
      <SideBar />
      <ComicBackgroundWrapper>
        <Outlet />
      </ComicBackgroundWrapper>
    </div>
  );
};
export default Dashboard;
