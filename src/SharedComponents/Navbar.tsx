import React, {useState} from 'react';
import { NavLink } from "react-router-dom";
import '../css/Navbar.css';
import '../css/Home.css';
import web from "../assets/talawa-logo-lite-200x200.png";
const Navbar = () => {

    const [navLinkOpen,navLinkToggle] = useState(false);
        
    const handleNavLinksToggle = () => {
        navLinkToggle(!navLinkOpen)
    };

    const renderClasses = () => {
        let classes = "navlinks";

        if(navLinkOpen) {
            classes += " active";
        }

        return classes
    }

    return (
        <nav>
            <div className = "main">
            <NavLink  className="logo" to = "/">
                <img src={web} />
                <h4><strong className = "Color_Green">Talawa</strong> <strong className = "Color_Yellow">Admin</strong></h4>
            </NavLink>
            </div>
            <ul className = {renderClasses()}>
                <li className = "link">
                    <a href="/">
                        Home
                    </a>
                </li>
                <li className = "link">
                    <a href="/Login">
                        Login
                    </a>
                </li>
                <li className = "link">
                    <a href="/About">
                        About
                    </a>
                </li>
            </ul>    
            <div onClick = {handleNavLinksToggle} className = "hamburger-toggle">
                <i className = "fas fa-bars fa-lg"></i>
            </div>
        </nav>
    );
};

export default Navbar;