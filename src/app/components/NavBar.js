"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import useAppStore from "../store/useStore";

export const NavBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isLogined = useAppStore((state) => state.isLogined);
  const auth_name = useAppStore((state) => state.auth_name);
  const setLogout = useAppStore((state) => state.setLogout);

  const handleLogout = () => {
    setLogout();
    router.push("/manageaccountadmin/adminlogin");
  };

  return (
    <nav className="navbar navbar-expand-lg bgHeaderNav">
      <div className="container-fluid">
        {/* Brand */}
        <a className="navbar-brand text-white" href="#">
          Admin Panel
        </a>

        {/* Toggler for mobile */}
        {isLogined && (
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        )}

        {/* Collapsible content */}
        {isLogined && (
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a
                  className="nav-link text-white"
                 
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/manageaccountadmin/dashboard");
                  }}
                >
                  Dashboard
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link text-white"
                 
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/manageaccountadmin/manageprofileimages");
                  }}
                >
                  Manage Profile Images
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link text-white"
                  
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/manageaccountadmin/manageposts");
                  }}
                >
                  Create New Post
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link text-white"
                  
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/manageaccountadmin/posthistory");
                  }}
                >
                  Post History
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link text-white"
                   
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/manageaccountadmin/manageabout");
                  }}
                >
                  Edit About Me
                </a>
              </li>
              <li className="nav-item">
                
                <a
                  className="nav-link text-white"
                  onClick={handleLogout}
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};
