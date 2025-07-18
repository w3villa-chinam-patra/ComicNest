import { useState } from "react";
import { appConstants, errorMessages } from "../../../../constants";
import toast from "react-hot-toast";
import { sendOtpSms } from "../../../../api/auth.api";
import { useAuth } from "../../../../contexts/AuthContext";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const SendOtpSms = () => {
  const { setUser } = useAuth();
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showDropdown, setShowDropdown] = useState(
    appConstants.TRUTHY_FALSY_VALUES.FALSE
  );
  const [isLoading, setIsLoading] = useState(
    appConstants.TRUTHY_FALSY_VALUES.FALSE
  );

  const handleSendOtpSms = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const only10Digits = /^[\d]{10}$/;
    if (!only10Digits.test(phoneNumber)) {
      toast.error(errorMessages.INVALID_MOBILE_NUMBER);
      return;
    }
    try {
      setIsLoading(appConstants.TRUTHY_FALSY_VALUES.TRUE);
      const response = await sendOtpSms(`${countryCode}${phoneNumber}`);
      if (response.isSuccess) {
        toast.success(response.message);
        setUser((prevUser) => {
          if (!prevUser) return prevUser;
          return { ...prevUser, mobileNumber: phoneNumber };
        });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    } finally {
      setIsLoading(appConstants.TRUTHY_FALSY_VALUES.FALSE);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const onlyDigits = /^\d*$/;
    if (onlyDigits.test(input)) {
      setPhoneNumber(input);
    }
  };

  const handleCountrySelect = (code: string) => {
    setCountryCode(code);
    setShowDropdown(appConstants.TRUTHY_FALSY_VALUES.FALSE);
  };
  return (
    <form
      className="w-full sm:max-w-md bg-neutral-800 shadow p-4 py-6 sm:p-6 sm:rounded-lg"
      onSubmit={handleSendOtpSms}
    >
      <div className="flex items-center">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDropdown((prev) => !prev)}
            className="shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center border rounded-s-lg focus:ring-4 focus:outline-none focus:ring-neutral-100 bg-neutral-700 hover:bg-neutral-600 focus:ring-neutral-700 text-white border-neutral-600"
          >
            {countryCode}
            <svg
              className="w-2.5 h-2.5 ms-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute z-10 divide-y divide-neutral-100 rounded-lg shadow-sm w-52 bg-neutral-700">
              <ul className="py-2 text-sm text-neutral-700 dark:text-neutral-200">
                <li>
                  <button
                    type="button"
                    className="inline-flex w-full px-4 py-2 hover:bg-neutral-600 hover:text-white"
                    onClick={() => handleCountrySelect("+91")}
                  >
                    🇮🇳 India (+91)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="inline-flex w-full px-4 py-2 hover:bg-neutral-600 hover:text-white"
                    onClick={() => handleCountrySelect("+1")}
                  >
                    🇺🇸 USA (+1)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="inline-flex w-full px-4 py-2 hover:bg-neutral-600 hover:text-white"
                    onClick={() => handleCountrySelect("+44")}
                  >
                    🇬🇧 UK (+44)
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        <label htmlFor="phone-input" className="sr-only">
          Phone number:
        </label>
        <div className="relative w-full">
          <input
            type="text"
            id="phone-input"
            className="block p-2.5 w-full outline-none z-20 text-sm rounded-e-lg border-s-1 border focus:ring-amber-500 bg-neutral-700 border-s-neutral-700  border-neutral-600 placeholder-neutral-400 text-white focus:border-amber-500"
            placeholder="9876543210"
            value={phoneNumber}
            onChange={handlePhoneChange}
            required
            maxLength={10}
          />
        </div>
      </div>
      <p className="mt-2 mb-4 text-sm text-neutral-500 dark:text-neutral-400">
        We will send you an SMS with a verification code.
      </p>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full flex justify-center items-center gap-2 cursor-pointer px-4 py-2 text-white font-medium ${
          isLoading ? "bg-amber-500" : "bg-amber-600"
        } hover:bg-amber-500 active:bg-amber-600 rounded-lg duration-150`}
      >
        Send verification code
        {isLoading ? (
          <AiOutlineLoading3Quarters className="animate-spin" />
        ) : (
          ""
        )}
      </button>
    </form>
  );
};
export default SendOtpSms;
