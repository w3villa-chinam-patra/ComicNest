import { useEffect, useRef, useState } from "react";
import { appConstants } from "../../../../constants";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  isOtpAlreadySent,
  sendOtpSms,
  verifyOtp,
} from "../../../../api/auth.api";
import { useAuth } from "../../../../contexts/AuthContext";
import toast from "react-hot-toast";

const VerifyOtp = ({ mobileNumber }: { mobileNumber: string }) => {
  const { setUser } = useAuth();
  const [otp, setOtp] = useState(Array(appConstants.OTP_DIGIT_LENGTH).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isVerifyLoading, setIsVerifyLoading] = useState(
    appConstants.TRUTHY_FALSY_VALUES.FALSE
  );
  const [alreadyOtpSentPrompt, setAlreadyOtpSentPrompt] = useState("");
  const [resendTimer, setResendTimer] = useState(appConstants.RESEND_WAIT_TIME);
  const [isResendAvailable, setIsResendAvailable] = useState(
    appConstants.TRUTHY_FALSY_VALUES.FALSE
  );
  const [isResendLoading, setIsResendLoading] = useState(
    appConstants.TRUTHY_FALSY_VALUES.FALSE
  );

  useEffect(() => {
    (async () => {
      try {
        setIsVerifyLoading(appConstants.TRUTHY_FALSY_VALUES.TRUE);
        const response = await isOtpAlreadySent(mobileNumber);
        if (response.isSuccess) {
          setAlreadyOtpSentPrompt(response.message);
        }
      } catch (error) {
        const err = error as Error;
        toast.error(err.message);
      } finally {
        setIsVerifyLoading(appConstants.TRUTHY_FALSY_VALUES.FALSE);
      }
    })();
  }, []);

  useEffect(() => {
    let timer: any;

    if (!isResendAvailable) {
      timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsResendAvailable(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isResendAvailable]);

  const handleResendOtp = async () => {
    try {
      setIsResendLoading(appConstants.TRUTHY_FALSY_VALUES.TRUE);
      const response = await sendOtpSms(mobileNumber);
      if (response.isSuccess) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    } finally {
      setIsResendLoading(appConstants.TRUTHY_FALSY_VALUES.FALSE);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    const key = e.key;

    if (
      !/^[0-9]$/.test(key) &&
      key !== "Backspace" &&
      key !== "Delete" &&
      key !== "Tab"
    ) {
      e.preventDefault();
    }

    if (key === "Backspace") {
      e.preventDefault();
      setOtp((prev) => {
        const updated = [...prev];
        if (updated[index]) {
          updated[index] = "";
        } else if (index > 0) {
          updated[index - 1] = "";
          inputRefs.current[index - 1]?.focus();
        }
        return updated;
      });
    }

    if (key === "Delete") {
      e.preventDefault();
      setOtp((prev) => {
        const updated = [...prev];
        updated[index] = "";
        return updated;
      });
    }
  };

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (!/^[0-9]$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    const nextIndex = index + 1;
    if (nextIndex < otp.length) {
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").trim();
    if (!/^\d{4}$/.test(text)) return;

    const digits = text.split("").slice(0, otp.length);
    setOtp(digits);
    digits.forEach((digit, i) => {
      if (inputRefs.current[i]) {
        inputRefs.current[i]!.value = digit;
      }
    });
    inputRefs.current[digits.length - 1]?.focus();
  };

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await verifyOtp(otp.join(""));
      if (response.isSuccess) {
        toast.success(response.message);
        setUser(null);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-md">
      {alreadyOtpSentPrompt && (
        <div className="text-sm text-center text-cyan-600 bg-cyan-950 p-4 rounded-lg border border-cyan-600">
          {alreadyOtpSentPrompt}
        </div>
      )}
      <div className="w-full flex justify-center items-center sm:max-w-md bg-neutral-800 shadow p-4 py-6 sm:p-6 sm:rounded-lg">
        <section>
          <div className=" mx-auto px-4">
            <p className="py-2 text-sm font-semibold text-neutral-300">
              Enter your OTP
            </p>

            <form
              id="otp-form"
              className="flex flex-col gap-4"
              onSubmit={handleVerifyOtp}
            >
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onFocus={handleFocus}
                    onPaste={handlePaste}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    className="w-14 h-14 rounded-xl border border-neutral-500 text-center text-2xl font-semibold text-white shadow-sm outline-none transition focus:ring-1 focus:ring-primary focus:ring-amber-600 bg-dark-2"
                  />
                ))}
              </div>
              <button
                type="submit"
                disabled={isVerifyLoading}
                className={`w-full flex justify-center items-center gap-2 cursor-pointer px-4 py-2 text-white font-medium ${
                  isVerifyLoading ? "bg-amber-500" : "bg-amber-600"
                } hover:bg-amber-500 active:bg-amber-600 rounded-lg duration-150`}
              >
                Verify
                {isVerifyLoading && (
                  <AiOutlineLoading3Quarters className="animate-spin" />
                )}
              </button>

              {/* Resend OTP Section */}
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={
                    !isResendAvailable || isVerifyLoading || isResendLoading
                  }
                  className={`w-full flex justify-center items-center gap-2 px-4 py-2 font-medium rounded-lg duration-150 ${
                    isResendAvailable
                      ? "bg-blue-700 text-white hover:bg-blue-600"
                      : "bg-neutral-700 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Resend OTP
                  {isResendLoading && (
                    <AiOutlineLoading3Quarters className="animate-spin" />
                  )}
                  {!isResendAvailable && (
                    <span className="ml-2 text-sm text-gray-300">
                      (
                      {Math.floor(resendTimer / 60)
                        .toString()
                        .padStart(2, "0")}
                      :{(resendTimer % 60).toString().padStart(2, "0")})
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default VerifyOtp;
