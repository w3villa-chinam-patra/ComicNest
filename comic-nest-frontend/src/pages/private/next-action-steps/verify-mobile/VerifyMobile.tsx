import { useAuth } from "../../../../contexts/AuthContext";
import SendOtpSms from "./SendOtpSms";
import VerifyOtp from "./VerifyOtp";

const PhoneVerificationForm: React.FC = () => {
  const { user } = useAuth();

  if (!user?.mobileNumber && !user?.mobileVerified) {
    return <SendOtpSms />;
  } else if (!user.mobileVerified) {
    return <VerifyOtp mobileNumber={user.mobileNumber} />;
  } else {
    return <></>;
  }
};

export default PhoneVerificationForm;
