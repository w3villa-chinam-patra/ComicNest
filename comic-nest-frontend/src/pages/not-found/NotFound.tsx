import { Link } from "react-router-dom";
import { appConstants } from "../../constants";

const NotFound = () => {
  return (
    <main className="relative bg-[url('/images/background.jpg')]">
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-start h-screen md:px-8">
        <div className="max-w-lg z-10 mx-auto text-center flex flex-col justify-center">
          <div className="flex justify-center">
            <Link to={appConstants.APP_ROUTES.HOME} className="pb-6">
              <img src="/logo.png" width={100} className="mx-auto" />
            </Link>
          </div>
          <h3 className="text-gray-300 text-4xl font-semibold sm:text-5xl">
            Page not found
          </h3>
          <p className="text-gray-400 mt-3">
            Sorry, the page you are looking for could not be found or has been
            removed.
          </p>
        </div>
      </div>
    </main>
  );
};
export default NotFound;
