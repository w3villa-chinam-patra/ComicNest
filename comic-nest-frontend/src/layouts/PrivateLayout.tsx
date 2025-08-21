import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getProfile } from "../api/user.api";
import toast from "react-hot-toast";
import { appConstants } from "../constants";
import Dashboard from "../pages/private/dashboard/Dashboard";
import { ComicBackgroundWrapper, Loader } from "../components";

const PrivateLayout = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(
    appConstants.TRUTHY_FALSY_VALUES.FALSE
  );
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(appConstants.TRUTHY_FALSY_VALUES.TRUE);
        if (!user) {
          const response = await getProfile();
          if (response.isSuccess) {
            login(response.data);
          } else {
            toast.error(response.message);
            logout();
            navigate(appConstants.APP_ROUTES.LOGIN, {
              replace: appConstants.TRUTHY_FALSY_VALUES.TRUE,
            });
          }
        }
      } catch (error) {
        const err = error as Error;
        toast.error(err.message);
        navigate(appConstants.NEGATIVE_ONE);
      } finally {
        setIsLoading(appConstants.TRUTHY_FALSY_VALUES.FALSE);
      }
    })();
  }, [user]);
  if (isLoading) {
    return (
      <ComicBackgroundWrapper>
        <div className="flex justify-center items-center h-full w-full">
          <Loader />
        </div>
      </ComicBackgroundWrapper>
    );
  }
  return <Dashboard />;
};
export default PrivateLayout;
