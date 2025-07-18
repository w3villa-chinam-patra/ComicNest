import { Outlet } from "react-router-dom";
import { ComicBackgroundWrapper } from "../components";

const PublicLayout = () => {
  return (
    <ComicBackgroundWrapper>
      <Outlet />
    </ComicBackgroundWrapper>
  );
};

export default PublicLayout;
