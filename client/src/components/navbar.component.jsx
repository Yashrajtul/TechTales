import { useContext, useEffect, useState } from "react";
import darkLogo from "../imgs/logo-dark.png";
import lightLogo from "../imgs/logo-light.png";
import { Frame } from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { ThemeContext, UserContext } from "../App";
import UserNavigationPanel from "./user-navigation.component";
import axios from "axios";
import { storeInSession } from "../common/session";
const Navbar = () => {
  const navigate = useNavigate();
  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
  const [userNavPanel, setUserNavPanel] = useState(false);

  let { theme, setTheme } = useContext(ThemeContext);
  const {
    userAuth,
    userAuth: { access_token, profile_img, new_notification_available },
    setUserAuth,
  } = useContext(UserContext);
  const handleUserNavPanel = () => {
    setUserNavPanel((currentVal) => !currentVal);
  };
  const handleBlur = () => {
    setTimeout(() => {
      setUserNavPanel(false);
    }, 300);
  };
  const handleChange = (e) => {
    let query = e.target.value;
    if (e.keyCode === 13 && query.length) {
      navigate(`/search/${query}`);
    }
  };
  // console.log(userAuth)

  useEffect(() => {
    if (access_token) {
      axios
        .get(import.meta.env.VITE_SERVER_DOMAIN + "/new-notification", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
        .then(({ data }) => {
          setUserAuth({ ...userAuth, ...data });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [access_token]);

  const changeChage = () => {
    let newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.setAttribute("data-theme", newTheme);
    storeInSession("theme", newTheme);
  };
  return (
    <>
      <nav className="z-50 navbar">
        <Link to="/" className="flex flex-row items-center justify-center">
          {/* <img
            src={theme == "light" ? darkLogo : lightLogo}
            alt="logo"
            className="flex-none w-10"
          /> */}
          <Frame />
          <span className="ml-2 text-3xl">Techtales</span>
        </Link>

        <div
          className={
            " absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " +
            (searchBoxVisibility ? "show" : "hide")
          }
        >
          <input
            type="text"
            placeholder="Search"
            className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
            onKeyDown={handleChange}
          />

          <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
        </div>
        <div className="flex items-center gap-3 ml-auto md:gap-6 ">
          <button
            className="flex items-center justify-center w-12 h-12 rounded-full md:hidden bg-grey"
            onClick={() => setSearchBoxVisibility((currentVal) => !currentVal)}
          >
            <i className="text-xl fi fi-rr-search"></i>
          </button>

          <Link to="/editor" className="hidden gap-2 md:flex link ">
            <p>write</p>
            <i className="fi fi-rr-file-edit"></i>
          </Link>

          <button className="relative w-12 h-12 rounded-full bg-grey hover:bg-black/10 ">
            <i
              className={
                "fi fi-rr-" +
                (theme == "light" ? "moon-stars" : "sun") +
                " text-2xl block mt-1"
              }
              onClick={changeChage}
            ></i>
          </button>
          {access_token ? (
            <>
              <Link to="/dashboard/notifications">
                <button className="relative w-12 h-12 rounded-full bg-grey hover:bg-black/10 ">
                  <i className="block mt-1 fi fi-rr-bell text2xl"></i>
                  {new_notification_available && (
                    <span className="absolute z-10 w-3 h-3 rounded-full bg-red top-2 right-2"></span>
                  )}
                </button>
              </Link>
              <div
                className="relative"
                onClick={handleUserNavPanel}
                onBlur={handleBlur}
              >
                <button className="w-12 h-12 mt1">
                  <img
                    src={profile_img}
                    alt="Profile"
                    className="object-cover w-full h-full rounded-full"
                  />
                </button>
                {userNavPanel && <UserNavigationPanel />}
              </div>
            </>
          ) : (
            <>
              <Link className="py-2 btn-dark " to="/signin">
                Sign In
              </Link>
              <Link className="hidden py-2 btn-light md:block" to="/signup">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
      <Outlet />
    </>
  );
};
export default Navbar;
