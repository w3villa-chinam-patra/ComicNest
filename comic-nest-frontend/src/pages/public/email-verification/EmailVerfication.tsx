import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { verifyEmail } from "../../../api/auth.api";
import toast from "react-hot-toast";
import { appConstants, errorMessages } from "../../../constants";
import { Loader } from "../../../components";

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      try {
        if (!token) {
          toast.error(errorMessages.INVALID_EMAIL_VERIFICATION_LINK);
        } else {
          const response = await verifyEmail(token);
          if (response.isSuccess) {
            toast.success(response.message);
            navigate(appConstants.APP_ROUTES.LOGIN);
          } else {
            toast.error(response.message);
            navigate(appConstants.APP_ROUTES.HOME);
          }
        }
      } catch (error) {
        const err = error as Error;
        toast.error(err.message);
        navigate(appConstants.APP_ROUTES.HOME);
      }
    })();
  }, []);
  return (
    <div className="flex flex-col gap-4 justify-center items-center h-full">
      <Loader />
      <div className="text-gray-300">
        Hang tight! We're verifying your email.
      </div>
    </div>
  );
};
export default EmailVerification;
