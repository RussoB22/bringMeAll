import React from 'react';
import './style.css';
import logoImage from "../../assets/logo.jpg"; 

function Footer(props) {

  return (
    <footer className="footer">
      <div className="nav-links">
        {/* TODO: create links that go somewhere */}
        {/* <a href="#" className="nav-link">Product</a> */}
        <h2>
        <img src={logoImage} alt="Bring Me Logo" style={{ width: "96px", height: "54px", marginRight: "10px" }} /> 
           </h2>
        {/* <a href="#" className="nav-link">About</a> */}
      </div>
      <hr className="footer-line" />
      <div className="social-icons">
        <a href="https://www.instagram.com/bringmee2023/" className="social-icon-instagram">
          <i class="fa-brands fa-instagram"></i>
        </a>
        <a href="https://www.facebook.com/profile.php?id=100095047180618" className="social-icon-facebook">
          <i class="fa-brands fa-facebook"></i>
        </a>
        <a href="https://www.youtube.com/channel/UChY_0CBlJRhWbAQi9TZD9AA" className="social-icon-youtube">
          <i class="fa-brands fa-youtube"></i>
        </a>
      </div>
    </footer>
  );
}

export default Footer;
