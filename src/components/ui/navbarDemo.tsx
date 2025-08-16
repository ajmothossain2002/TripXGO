"use client";
import React, { useState, useEffect } from "react";
import { Menu, MenuItem, ProductItem } from "../ui/navbar-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";

export function NavbarDemo() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<{ name?: string; avatar?: string } | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");
    
    if (token) {
      setIsLoggedIn(true);
      if (userData) {
        try {
          setUserProfile(JSON.parse(userData));
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setIsLoggedIn(false);
    setUserProfile(null);
    router.push("/auth/login");
  };

  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar 
        className="top-2" 
        isLoggedIn={isLoggedIn}
        userProfile={userProfile}
        onLogout={handleLogout}
      />
    </div>
  );
}

function Navbar({ 
  className, 
  isLoggedIn, 
  userProfile, 
  onLogout 
}: { 
  className?: string;
  isLoggedIn: boolean;
  userProfile: { name?: string; avatar?: string } | null;
  onLogout: () => void;
}) {
  const [active, setActive] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <div className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50 hidden lg:block", className)}>
        <Menu setActive={setActive}>
          <Link href={"/"}>
            <MenuItem
              setActive={setActive}
              active={active}
              item="Home"
            />
          </Link>

          <Link href={"/Blogs"}>
            <MenuItem
              setActive={setActive}
              active={active}
              item="Blogs"
            />
          </Link>

          <MenuItem setActive={setActive} active={active} item="Services">
            <div className="text-sm grid grid-cols-2 gap-10 p-4">
              <ProductItem
                title="AI-powered Trip planner"
                href="/aitrip"
                src="https://assets.aceternity.com/demos/algochurn.webp"
                description="Plan your trip with us."
              />
              <ProductItem
                title="Contact"
                href="/Contact"
                src="https://assets.aceternity.com/demos/tailwindmasterkit.webp"
                description="Contact Us at webSkitter Academy"
              />
            </div>
          </MenuItem>

          {isLoggedIn ? (
            <MenuItem setActive={setActive} active={active} item="Profile">
              <div className="flex flex-col space-y-4 text-sm p-4">
                {/* Profile Section */}
                <div className="flex items-center space-x-3 pb-2 border-b">
                  {userProfile?.avatar ? (
                    <Image 
                      src={userProfile.avatar} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover"
                      width={32}
                      height={32}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-600 text-xs">
                        {userProfile?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  <span className="font-medium">
                    {userProfile?.name || 'User'}
                  </span>
                </div>

                {/* Profile Actions */}
                <div className="flex flex-col space-y-2">
                  <Link href="/profile" className="text-neutral-700 hover:text-black">
                    View Profile
                  </Link>
                  <Link href="/settings" className="text-neutral-700 hover:text-black">
                    Settings
                  </Link>
                  <button 
                    onClick={onLogout}
                    className="text-left text-red-600 hover:text-red-800"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </MenuItem>
          ) : (
            <>
              <Link href="/login">
                <MenuItem setActive={setActive} active={active} item="Login" />
              </Link>

              <Link href="/register">
                <MenuItem setActive={setActive} active={active} item="Register" />
              </Link>
            </>
          )}
        </Menu>
      </div>

      {/* Mobile Navigation Header */}
      <div className={cn("fixed top-4 left-4 right-4 flex items-center justify-between lg:hidden z-50", className)}>
        {/* Logo/Brand */}
        <Link href="/" className="text-xl font-bold text-black">
          Ai-tripX
        </Link>

        {/* Profile/Login section for mobile header */}
        <div className="flex items-center space-x-4">
          {isLoggedIn && userProfile && (
            <div className="flex items-center space-x-2">
              {userProfile?.avatar ? (
                <Image 
                  src={userProfile.avatar} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover"
                  width={32}
                  height={32}
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600 text-xs">
                    {userProfile?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              )}
              <span className="text-sm font-medium hidden sm:block">
                {userProfile?.name || 'User'}
              </span>
            </div>
          )}

          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <span 
                className={cn(
                  "block h-0.5 bg-gray-600 transition-all duration-300",
                  isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                )}
              />
              <span 
                className={cn(
                  "block h-0.5 bg-gray-600 transition-opacity duration-300",
                  isMobileMenuOpen ? "opacity-0" : ""
                )}
              />
              <span 
                className={cn(
                  "block h-0.5 bg-gray-600 transition-all duration-300",
                  isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                )}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div className={cn(
        "fixed top-0 left-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 lg:hidden",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Menu Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={closeMobileMenu}
            className="p-2 rounded-md hover:bg-gray-100"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <div className="p-6 space-y-6">
          {/* Navigation Links */}
          <div className="space-y-4">
            <Link 
              href="/" 
              className="block text-lg font-medium text-gray-900 hover:text-blue-600"
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            
            <Link 
              href="/Blogs" 
              className="block text-lg font-medium text-gray-900 hover:text-blue-600"
              onClick={closeMobileMenu}
            >
              Blogs
            </Link>

            {/* Services Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Services</h3>
              <div className="pl-4 space-y-3">
                <Link 
                  href="/aitrip"
                  className="block text-gray-600 hover:text-blue-600"
                  onClick={closeMobileMenu}
                >
                  <div>
                    <div className="font-medium">AI-powered Trip planner</div>
                    <div className="text-sm text-gray-500">Plan your trip with us.</div>
                  </div>
                </Link>
                
                <Link 
                  href="/Contact"
                  className="block text-gray-600 hover:text-blue-600"
                  onClick={closeMobileMenu}
                >
                  <div>
                    <div className="font-medium">Contact</div>
                    <div className="text-sm text-gray-500">Contact Us at webSkitter Academy</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* User Section */}
          <div className="border-t pt-6">
            {isLoggedIn ? (
              <div className="space-y-4">
                {/* User Profile Info */}
                <div className="flex items-center space-x-3 pb-4">
                  {userProfile?.avatar ? (
                    <Image 
                      src={userProfile.avatar} 
                      alt="Profile" 
                      className="w-12 h-12 rounded-full object-cover"
                      width={48}
                      height={48}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-600">
                        {userProfile?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-gray-900">
                      {userProfile?.name || 'User'}
                    </div>
                    <div className="text-sm text-gray-500">
                      Signed in
                    </div>
                  </div>
                </div>

                {/* Profile Actions */}
                <div className="space-y-3">
                  <Link 
                    href="/profile" 
                    className="block text-gray-600 hover:text-blue-600"
                    onClick={closeMobileMenu}
                  >
                    View Profile
                  </Link>
                  <Link 
                    href="/settings" 
                    className="block text-gray-600 hover:text-blue-600"
                    onClick={closeMobileMenu}
                  >
                    Settings
                  </Link>
                  <button 
                    onClick={() => {
                      onLogout();
                      closeMobileMenu();
                    }}
                    className="block w-full text-left text-red-600 hover:text-red-800"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Link 
                  href="/login"
                  className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
                <Link 
                  href="/register"
                  className="block w-full text-center border border-blue-600 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-50"
                  onClick={closeMobileMenu}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}