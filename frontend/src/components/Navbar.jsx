import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { Film, MapPin, Search, User, LogOut, Ticket, ShieldAlert, Menu, X, ChevronDown } from 'lucide-react';

const CITIES = ['Coimbatore', 'Chennai', 'Bangalore', 'Mumbai', 'Kochi', 'Hyderabad'];

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { bookingState, selectCity } = useBooking();
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isMobileMenu, setIsMobileMenu] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setUserDropdown(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 backdrop-blur-xl bg-[#0b0e14]/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform duration-300">
                <Film className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-2xl tracking-tight text-white flex items-center gap-1">
                  CINE<span className="text-rose-500">PASS</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold -mt-1">Movie Experience</span>
              </div>
            </Link>

            {/* City Selector */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsCityOpen(!isCityOpen)}
                className="flex items-center space-x-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white px-3.5 py-1.5 rounded-lg border border-slate-700/60 transition text-sm font-medium"
              >
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>{bookingState.city}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isCityOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Location</div>
                  {CITIES.map(city => (
                    <button
                      key={city}
                      onClick={() => {
                        selectCity(city);
                        setIsCityOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-rose-500/10 hover:text-rose-400 transition ${
                        bookingState.city === city ? 'text-rose-500 font-semibold bg-rose-500/10' : 'text-slate-300'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                isActive('/') ? 'text-rose-500 bg-rose-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Home
            </Link>
            <Link
              to="/movies"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                isActive('/movies') ? 'text-rose-500 bg-rose-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Movies
            </Link>
            <Link
              to="/theatres"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                isActive('/theatres') ? 'text-rose-500 bg-rose-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Theatres
            </Link>
            <Link
              to="/about"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                isActive('/about') ? 'text-rose-500 bg-rose-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                isActive('/contact') ? 'text-rose-500 bg-rose-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Contact
            </Link>
            
            {user && !isAdmin && (
              <Link
                to="/my-bookings"
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  isActive('/my-bookings') ? 'text-rose-500 bg-rose-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                My Bookings
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="ml-2 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30 transition flex items-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Admin Panel
              </Link>
            )}
          </div>

          {/* User Auth Controls */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center space-x-3 bg-slate-900/90 border border-slate-800 hover:border-slate-700 px-4 py-2 rounded-xl text-slate-200 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center font-bold text-sm text-white shadow-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left hidden xl:block">
                    <div className="text-sm font-semibold text-slate-100">{user.name}</div>
                    <div className="text-[10px] text-slate-400 capitalize">{user.role.toLowerCase()}</div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {userDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-sm font-semibold text-white">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                    
                    {!isAdmin ? (
                      <>
                        <Link
                          to="/dashboard"
                          onClick={() => setUserDropdown(false)}
                          className="flex items-center space-x-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
                        >
                          <User className="w-4 h-4 text-rose-500" />
                          <span>Customer Dashboard</span>
                        </Link>
                        <Link
                          to="/my-bookings"
                          onClick={() => setUserDropdown(false)}
                          className="flex items-center space-x-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
                        >
                          <Ticket className="w-4 h-4 text-rose-500" />
                          <span>My Bookings</span>
                        </Link>
                      </>
                    ) : (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center space-x-2.5 px-4 py-2.5 text-sm text-amber-400 hover:bg-amber-500/10 transition"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        <span>Admin Portal</span>
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center space-x-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Account Settings</span>
                    </Link>

                    <div className="border-t border-slate-800 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 rounded-xl shadow-glow hover:shadow-glow-lg transition-all duration-300"
                >
                  Get Tickets
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenu(!isMobileMenu)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {isMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenu && (
        <div className="md:hidden bg-[#0b0e14] border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setIsMobileMenu(false)}
            className="block px-3 py-2 rounded-lg text-slate-200 font-medium hover:bg-slate-800"
          >
            Home
          </Link>
          <Link
            to="/movies"
            onClick={() => setIsMobileMenu(false)}
            className="block px-3 py-2 rounded-lg text-slate-200 font-medium hover:bg-slate-800"
          >
            Movies
          </Link>
          <Link
            to="/theatres"
            onClick={() => setIsMobileMenu(false)}
            className="block px-3 py-2 rounded-lg text-slate-200 font-medium hover:bg-slate-800"
          >
            Theatres
          </Link>
          <Link
            to="/about"
            onClick={() => setIsMobileMenu(false)}
            className="block px-3 py-2 rounded-lg text-slate-200 font-medium hover:bg-slate-800"
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={() => setIsMobileMenu(false)}
            className="block px-3 py-2 rounded-lg text-slate-200 font-medium hover:bg-slate-800"
          >
            Contact
          </Link>

          {user ? (
            <>
              <div className="border-t border-slate-800 pt-3">
                <p className="px-3 text-xs font-semibold text-slate-400 uppercase">Account</p>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenu(false)}
                  className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 mt-1"
                >
                  Dashboard
                </Link>
                <Link
                  to="/my-bookings"
                  onClick={() => setIsMobileMenu(false)}
                  className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800"
                >
                  My Bookings
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsMobileMenu(false)}
                    className="block px-3 py-2 rounded-lg text-amber-400 hover:bg-amber-500/10"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 mt-2"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="border-t border-slate-800 pt-3 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setIsMobileMenu(false)}
                className="w-full text-center px-4 py-2.5 rounded-xl text-slate-200 bg-slate-900 border border-slate-800 font-semibold"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMobileMenu(false)}
                className="w-full text-center px-4 py-2.5 rounded-xl text-white bg-rose-600 font-semibold shadow-glow"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
