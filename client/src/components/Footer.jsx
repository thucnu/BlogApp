import React from "react";
import Logo from "../img/logo.svg";

const Footer = () => {
  return (
    <footer>
      <img src={Logo} />
      <span>
        Made with heart and <b>React.js</b>
      </span>
    </footer>
  );
};

export default Footer;
