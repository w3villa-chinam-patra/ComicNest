import { Route, Routes } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import Home from "../pages/public/home/Home";
import Login from "../pages/public/login/Login";
import Register from "../pages/public/register/Register";
import NotFound from "../pages/not-found/NotFound";
import EmailVerification from "../pages/public/email-verification/EmailVerfication";
import { appConstants } from "../constants";
import PrivateLayout from "../layouts/PrivateLayout";
import PricingSection from "../components/PricingSection";
import { useAxiosInterceptor } from "../hooks/useAxiosInterceptor";
import Explore from "../pages/private/explore/Explore";

const AppRoutes = () => {
  useAxiosInterceptor();

  return (
    <Routes>
      {/* public routes */}
      <Route element={<PublicLayout />}>
        <Route path={appConstants.APP_ROUTES.HOME} element={<Home />} />
        <Route path={appConstants.APP_ROUTES.LOGIN} element={<Login />} />
        <Route path={appConstants.APP_ROUTES.REGISTER} element={<Register />} />
        <Route
          path={appConstants.APP_ROUTES.EMAIL_VERIFY}
          element={<EmailVerification />}
        />
      </Route>
      <Route
        element={<PrivateLayout />}
        path={appConstants.APP_ROUTES.DASHBOARD}
      >
        <Route index path={appConstants.APP_ROUTES.EXPLORE} element={<Explore />} />
        <Route
          path={appConstants.APP_ROUTES.PLANS}
          element={<PricingSection />}
        />
      </Route>
      {/* fallback route */}
      <Route path={appConstants.APP_ROUTES.FALLBACK} element={<NotFound />} />
    </Routes>
  );
};
export default AppRoutes;
