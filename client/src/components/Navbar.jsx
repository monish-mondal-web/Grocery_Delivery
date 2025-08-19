import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Navbar = () => {
  // Separate states
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  // Logout function
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
      toast.error(error.message);
    }
  };

  // Close profile dropdown when clicking outside (Laptop only)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Redirect to products when search query changes
  useEffect(() => {
    if (searchQuary.length > 0) {
      navigate("/products");
    }
  }, [searchQuary]);

  return (
    <nav className="flex items-center justify-between px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 py-3 border-b border-gray-300 bg-white relative transition-all sticky top-0 z-50">
      {/* Logo */}
      <NavLink
        to="/"
        onClick={() => {
          setProfileOpen(false);
          setMenuOpen(false);
        }}
        className="flex items-center"
      >
        <img className="w-28 sm:w-36" src={assets.logo_monish} alt="Logo" />
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

        {/* Search Box (Desktop Only) */}
        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
          <input
            onChange={(e) => setSearchQuary(e.target.value)}
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Search products"
          />
          <img className="w-4 h-4" src={assets.search_icon} alt="Search" />
        </div>

        {/* Cart */}
        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer"
        >
          <img className="w-6 h-6" src={assets.nav_cart_icon} alt="Cart" />
          <span className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] flex items-center justify-center rounded-full">
            {getCartCount()}
          </span>
        </div>

        {/* Profile / Login */}
        {!user ? (
          <button
            onClick={() => setShowUserLogin(true)}
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
              onClick={() => setProfileOpen(!profileOpen)}
            />
            {/* Dropdown Menu */}
            {profileOpen && (
              <ul className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                <li
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/my-order");
                  }}
                  className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer transition"
                >
                  My Orders
                </li>
                <li
                  onClick={() => {
                    setProfileOpen(false);
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

      {/* Mobile Right Section */}
      <div className="flex items-center gap-4 sm:hidden">
        {/* Cart */}
        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer"
        >
          <img className="w-6 h-6" src={assets.nav_cart_icon} alt="Cart" />
          <span className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] flex items-center justify-center rounded-full">
            {getCartCount()}
          </span>
        </div>
        {/* Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          className="sm:hidden"
        >
          <img src={assets.menu_icon} alt="Menu" />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="absolute top-full left-0 w-full bg-white shadow-md py-4 flex flex-col items-start gap-3 px-6 text-sm sm:hidden z-40"
        >
          <NavLink
            to="/seller"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `w-full py-2 border-b font-medium ${
                isActive ? "text-blue-500 font-semibold" : "text-gray-700"
              }`
            }
          >
            Seller Portal
          </NavLink>

          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `w-full py-2 border-b ${
                isActive ? "text-blue-500 font-semibold" : "text-gray-700"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `w-full py-2 border-b ${
                isActive ? "text-blue-500 font-semibold" : "text-gray-700"
              }`
            }
          >
            All Product
          </NavLink>

          {user && (
            <NavLink
              to="/my-order"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `w-full py-2 border-b ${
                  isActive ? "text-blue-500 font-semibold" : "text-gray-700"
                }`
              }
            >
              My Orders
            </NavLink>
          )}

          {/* Search Bar */}
          <div className="w-full flex items-center gap-2 border border-gray-300 px-3 rounded-full mt-2">
            <input
              onChange={(e) => setSearchQuary(e.target.value)}
              className="py-2 w-full bg-transparent outline-none placeholder-gray-500 text-sm"
              type="text"
              placeholder="Search products"
            />
            <img className="w-4 h-4" src={assets.search_icon} alt="Search" />
          </div>

          {/* Login / Logout */}
          {!user ? (
            <button
              onClick={() => {
                setShowUserLogin(true);
                setMenuOpen(false);
              }}
              className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm w-full"
            >
              Login
            </button>
          ) : (
            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm w-full"
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
