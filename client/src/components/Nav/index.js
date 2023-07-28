import React from "react";
import Auth from "../../utils/auth";
import { Link, NavLink } from "react-router-dom";
import logoImage from "../../assets/logo.jpg"; 

function Nav() {
  function showNavigation() {
    if (Auth.loggedIn()) {
      return (
        <ul className="flex-row">
          <li className="mx-1">
            <NavLink exact to="/news" activeClassname="active">
              News
            </NavLink>
          </li>
          <li className="mx-1">
            <NavLink to="/leaderboard" activeClassname="active">
              Leaderboard
            </NavLink>
          </li>
          <li className="mx-1">
            <NavLink to="/profile" activeClassname="active">
              Profile
            </NavLink>
          </li>
          <li className="mx-1">
            <a href="/" onClick={() => Auth.logout()}>
              Logout
            </a>
          </li>
        </ul>
      );
      
    } else {
      return (
        <ul className="flex-row flexText">
          <li className="mx-1">
            <NavLink exact to="/news" activeClassname="active">
              News
            </NavLink>
          </li>
          <li className="mx-1">
            <NavLink to="/leaderboard" activeClassname="active">
              Leaderboard
            </NavLink>
          </li>
          <li className="mx-1">
            <NavLink to="/signup" activeClassname="active">
              Sign Up
            </NavLink>
          </li>
          <li className="mx-1">
            <NavLink to="/login" activeClassname="active">
              Login
            </NavLink>
          </li>
        </ul>
      );
    }
  }

  return (
    <header className="flex-row space-between">
      <h1 className='logoContainer'>
        <Link to="/" style={{ textDecoration: "none" }}>
          {/* Adjust the width, height, and margin as needed */}
          <img className='appLogo' src={logoImage} alt="Bring Me Logo"/> 
        </Link>
      </h1>

      <nav>{showNavigation()}</nav>
    </header>
  );
}

export default Nav;
