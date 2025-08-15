import React, { useEffect, useRef } from "react";
import { NavLink } from "react-router";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = React.useState(false);
  const {
    user,
    setUser,
    setShowUserLogin,
    navigate,
    searchQuary,
    setSearchQuary,
    getCartCount,
    axios,
  } = useAppContext();
  const profileRef = useRef(null);

  const logout = async () => {
    try {
      const { data } = await axios.get("api/user/logout");
      if (data.success) {
        toast.success(data.message);
        setUser(null);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(data.message);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchQuary.length > 0) {
      navigate("/products");
    }
  }, [searchQuary]);

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
      <NavLink
        to="/"
        onClick={() => {
          setOpen(false);
        }}
      >
        <img className="w-37" src={assets.logo_monish} alt="" />
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">All Product</NavLink>
        <NavLink
          to="/seller"
          className="relative px-3 py-1 rounded-md text-sm font-semibold text-blue-500 bg-blue-100 hover:bg-blue-200 transition-all duration-300"
        >
          Seller Portal
        </NavLink>

        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
          <input
            onChange={(e) => setSearchQuary(e.target.value)}
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Search products"
          />
          <img className="w-4 h-4" src={assets.search_icon} alt="" />
        </div>

        <div
          onClick={() => {
            navigate("/cart");
          }}
          className="relative cursor-pointer"
        >
          <img className="w-6 h-6" src={assets.nav_cart_icon} alt="" />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
            {getCartCount()}
          </button>
        </div>

        {!user ? (
          <button
            onClick={() => {
              setShowUserLogin(true);
            }}
            className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full"
          >
            Login
          </button>
        ) : (
          <div className="relative" ref={profileRef}>
            <img
              src={assets.profile_icon}
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer border border-gray-300"
              onClick={() => setOpen(!open)}
            />
            {/* Dropdown Menu */}
            {open && (
              <ul className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                <li
                  onClick={() => {
                    setOpen(false);
                    navigate("/my-order");
                  }}
                  className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer transition"
                >
                  My Orders
                </li>
                <li
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="px-4 py-2 text-sm text-red-500 hover:bg-gray-100 cursor-pointer transition"
                >
                  Logout
                </li>
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-6 sm:hidden">
        <div
          onClick={() => {
            navigate("/cart");
          }}
          className="relative cursor-pointer"
        >
          <img className="w-6 h-6" src={assets.nav_cart_icon} alt="" />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
            {getCartCount()}
          </button>
        </div>
        <button
          onClick={() => (open ? setOpen(false) : setOpen(true))}
          aria-label="Menu"
          className="sm:hidden"
        >
          {/* Menu Icon SVG */}
          <img src={assets.menu_icon} alt="" />
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div
          className={`${
            open ? "flex" : "hidden"
          } absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}
        >
          <NavLink onClick={() => setOpen(false)} to="/">
            Home
          </NavLink>
          <NavLink onClick={() => setOpen(false)} to="/products">
            All Product
          </NavLink>
          {user && (
            <NavLink onClick={() => setOpen(false)} to="/contacts">
              My Order
            </NavLink>
          )}
          {!user ? (
            <button
              onClick={() => {
                setOpen(false);
                setShowUserLogin(true);
              }}
              className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
            >
              Login
            </button>
          ) : (
            <button
              onClick={logout}
              className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
