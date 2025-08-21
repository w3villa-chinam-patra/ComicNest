import { Link } from "react-router-dom";
import { appConstants } from "../../../constants";

const Header = () => {
  return (
    <header className="fixed top-0 right-0 left-0 z-10 bg-neutral-900 flex items-center justify-between py-3 px-6 border-b border-neutral-700 drop-shadow-xl drop-shadow-neutral-800">
      <Link
        to={appConstants.APP_ROUTES.HOME}
        className="logo flex gap-2 items-center"
      >
        <img src="/logo.png" className="h-12" alt="logo" />
        <div className="logo-name text-2xl text-amber-400 font-black hidden sm:block">
          ComicNest
        </div>
      </Link>
      <div className="buttons flex gap-1 sm:gap-2">
        <Link
          to={appConstants.APP_ROUTES.LOGIN}
          className="text-sm font-semibold px-4 py-1 rounded-xl hover:bg-neutral-700 cursor-pointer"
        >
          Log in
        </Link>
        <Link
          to={appConstants.APP_ROUTES.REGISTER}
          className="text-sm font-semibold px-4 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 cursor-pointer"
        >
          Sign up - it's free
        </Link>
      </div>
    </header>
  );
};

export default Header;
