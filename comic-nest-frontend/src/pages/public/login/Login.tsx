import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { appConstants } from "../../../constants";
import { googleOAuth, login } from "../../../api/auth.api";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import API_ENDPOINTS from "../../../api/api-endpoints";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(
    appConstants.TRUTHY_FALSY_VALUES.FALSE
  );
  const navigate = useNavigate();
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(appConstants.TRUTHY_FALSY_VALUES.TRUE);
      const response = await login({ email, password });
      if (response.isSuccess) {
        toast.success(response.message);
        navigate(appConstants.APP_ROUTES.DASHBOARD, {
          replace: appConstants.TRUTHY_FALSY_VALUES.TRUE,
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

  // const googleOAuthLoginHandler = async () => {
  //   try {
  //     const response = await googleOAuth();
  //     if (response.isSuccess) {
  //       toast.success(response.message);
  //     } else {
  //       toast.error(response.message);
  //     }
  //   } catch (error) {
  //     const err = error as Error;
  //     toast.error(err.message);
  //   }
  // };

  return (
    <main className="w-full h-screen flex flex-col items-center justify-center sm:px-4">
      <div className="w-full space-y-6 text-gray-300 sm:max-w-md">
        <div className="text-center">
          <Link to={appConstants.APP_ROUTES.HOME}>
            <img src="/logo.png" width={80} className="mx-auto" />
          </Link>
          <div className="mt-5 space-y-2">
            <h3 className="text-gray-200 text-2xl font-bold sm:text-3xl">
              Log in to your account
            </h3>
            <p>
              Don't have an account?{" "}
              <Link
                to={appConstants.APP_ROUTES.REGISTER}
                className="font-medium text-amber-600 hover:text-amber-500"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <div className="bg-neutral-800 shadow p-4 py-6 space-y-8 sm:p-6 sm:rounded-lg">
          <div className="grid grid-cols-1 gap-x-3">
            <a
              href={`${appConstants.DEFAULT_API_BASE_URL}${API_ENDPOINTS.AUTH.GOOGLE_OAUTH_LOGIN}`}
              className="w-full cursor-pointer flex items-center justify-center gap-x-3 py-2.5 mt-5 border border-neutral-600 rounded-lg text-sm font-medium hover:bg-neutral-700 duration-150 active:bg-gray-100"
            >
              {/* Google Icon + Label */}
              <svg
                className="w-5 h-5"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Google SVG content */}
                <g clipPath="url(#clip0_17_40)">
                  <path
                    d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z"
                    fill="#34A853"
                  />
                  <path
                    d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z"
                    fill="#FBBC04"
                  />
                  <path
                    d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z"
                    fill="#EA4335"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_17_40">
                    <rect width="48" height="48" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Log In with Google
            </a>
            {/* <button className="flex items-center justify-center py-2.5 border border-neutral-600 rounded-lg hover:bg-neutral-700 cursor-pointer duration-150 active:bg-gray-800">
              <svg
                className="w-5 h-5"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_17_40)">
                  <path
                    d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z"
                    fill="#34A853"
                  />
                  <path
                    d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z"
                    fill="#FBBC04"
                  />
                  <path
                    d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z"
                    fill="#EA4335"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_17_40">
                    <rect width="48" height="48" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </button> */}
            {/* <button className="flex items-center justify-center py-2.5 border border-neutral-600 rounded-lg hover:bg-neutral-700 cursor-pointer duration-150 active:bg-gray-800">
              <FaFacebook className="text-cyan-600 text-2xl" />
            </button> */}
          </div>

          <div className="relative">
            <span className="block w-full h-px bg-gray-500"></span>
            <p className="inline-block w-fit text-sm bg-neutral-800 px-2 absolute -top-2 inset-x-0 mx-auto">
              Or continue with
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-2 px-3 py-2 text-gray-300 bg-transparent outline-none border border-neutral-600 focus:border-amber-500 shadow-sm rounded-lg"
              />
            </div>
            <div>
              <label className="font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full mt-2 px-3 py-2 text-gray-300 bg-transparent outline-none border border-neutral-600 focus:border-amber-500 shadow-sm rounded-lg"
              />
            </div>
            <button
              disabled={isLoading}
              className={`w-full flex justify-center items-center gap-2 cursor-pointer px-4 py-2 text-white font-medium ${
                isLoading ? "bg-amber-500" : "bg-amber-600"
              } hover:bg-amber-500 active:bg-amber-600 rounded-lg duration-150`}
            >
              Sign in
              {isLoading ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                ""
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Login;
