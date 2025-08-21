import { useEffect, useState, type JSX } from "react";
import { NextAction } from "../../../types";
import VerifyMobile from "./verify-mobile/VerifyMobile";
import { useAuth } from "../../../contexts/AuthContext";
import Steps from "../../../components/Steps";
import { appConstants } from "../../../constants";
import CompleteProfile from "./complete-profile/CompleteProfile";
import UploadProfilePhoto from "./UploadProfilePhoto";

const NextActionSteps = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(
    appConstants.TRUTHY_FALSY_VALUES.ZERO
  );
  const stepsItems = [
    "Mobile Verification",
    "Complete Profile",
    "Upload Profile Photo",
  ];
  const nextStepComponentMap: Record<
    Exclude<
      NextAction,
      typeof NextAction.EMAIL_VERIFICATION | typeof NextAction.NONE
    >,
    JSX.Element
  > = {
    [NextAction.MOBILE_VERIFICATION]: <VerifyMobile />,
    [NextAction.PROFILE_COMPLETION]: <CompleteProfile />,
    [NextAction.PHOTO_UPLOAD]: <UploadProfilePhoto />,
  };
  const isNextStepKey = (
    value: NextAction
  ): value is keyof typeof nextStepComponentMap => {
    return value in nextStepComponentMap;
  };
  useEffect(() => {
    if (user) {
      setCurrentStep(
        Object.keys(nextStepComponentMap).indexOf(user?.nextAction) +
          appConstants.TRUTHY_FALSY_VALUES.ONE
      );
    }
  }, [user]);

  return (
    <div className="flex flex-col h-full">
      <div className="my-4">
        <Steps stepsItems={stepsItems} currentStep={currentStep} />
      </div>
      <div className="flex-1 flex justify-center items-center">
        {isNextStepKey(user?.nextAction!)
          ? nextStepComponentMap[user?.nextAction!]
          : null}
      </div>
    </div>
  );
};
export default NextActionSteps;
