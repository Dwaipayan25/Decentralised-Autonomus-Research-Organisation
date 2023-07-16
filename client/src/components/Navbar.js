import React from "react";
import "./Navbar.css";
// import { accessListify } from 'ethers/lib/utils';
import { Link } from "react-router-dom";

const Navbar = ({ account }) => {
  const shortenAddress = (address) => {
    return `${address.substring(0, 5)}...${address.substring(
      address.length - 4,
      address.length
    )}`;
  };
  const acc = shortenAddress(account);
  return (
    <nav className="navbar">
      <Link to="/" style={{ textDecoration: 'none' }}>
      <div className="navbar-left" style={{ textDecoration: 'none' }}>
        <h1 className="navbar-title" style={{ textDecoration: 'none' }}>DARO</h1>
      </div>
      </Link>
      <div className="navbar-right">
      <Link to="/profile"><button className="navbar-button">Profile</button></Link>
      <Link to="/publications"><button className="navbar-button">Publications</button></Link>
        <button className="navbar-button1">Connected Account: {acc}</button>
      </div>
    </nav>
  );
};

export default Navbar;
