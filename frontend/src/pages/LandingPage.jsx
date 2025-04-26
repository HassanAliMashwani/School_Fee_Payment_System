// pages/LandingPage.js
// import '../../styles/landingPage.css'
import "../Styles/landingpage.css";
import girl from "../Assets/Images/girl.png";
import boy from "../Assets/Images/boy.png";
import User from "../components/User/User";
import Logo from "../components/Logo/Logo";
import useClickAway from "../hooks/useClickAway";
import GetStarted from "./GetStarted/GetStarted";
import NavigationMenu from "../components/Navigation/NavigationMenu";
import HeaderLine from "../components/HeaderLine/HeaderLine";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import Login from "./Login";
import Register from "./Register";
import { setPopup, setPopupType } from "../features/popups/popupSlice";
import ProgressWidget from "../components/Utilities/Progress/ProgressWidget/ProgressWidget";
import { useNavigate } from 'react-router-dom'; // If you are using React Router

// Single Responsibility Principle (SRP) - Each component should have a single responsibility
const LandingPage = () => {
  const { popup } = useSelector((state) => state.popups);
  const { popupType } = useSelector((state) => state.popups);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const roles = user ? Object.values(user) : null;
  const gettingStartedRef = useRef();

  // If using React Router for navigation
  const navigate = useNavigate();

  // Open-Closed Principle (OCP) - A class should be open for extension but closed for modification
  // We can add more popup types without modifying the existing code
  const handlePopup = (type) => {
    dispatch(setPopup(!popup));
    dispatch(setPopupType(type));
  };

  // Interface Segregation Principle (ISP) - A client should not be forced to depend on interfaces it does not use
  // We can separate the navigation logic into a separate function
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Dependency Inversion Principle (DIP) - High-level modules should not depend on low-level modules
  // We can inject the dependencies instead of hardcoding them
  const handlePayNowClick = () => {
    console.log("Pay Now button clicked");
    handleNavigation('/Payments');
  };

  const handleAddSchoolClick = () => {
    alert("Add School button clicked - Navigating to registration form");
    handleNavigation('/register-school');
  };

  const handleRegisterStudentClick = () => {
    console.log("Register Student button clicked");
    handleNavigation('/RegisterStudent');
    handlePopup("Register");
  };

  const showGettingStarted = () => {
    handlePopup("GettingStarted");
  };

  return (
    <div className="landing-page-body">
      {popupType === "Login" && (
        <div>
          <Login />
        </div>
      )}
      {popupType === "Register" && (
        <div>
          <Register />
        </div>
      )}
      {popupType === "GettingStarted" && (
        <div>
          <GetStarted />
        </div>
      )}
      <div className="header-container">
        <div className="header-subcontainer">
          <header className="landing-header-contents">
            <Logo />
            <NavigationMenu />
            <User  />
          </header>
          <HeaderLine />
        </div>
      </div>
      <main>
        <div className="main-title-wrapper">
          <div className="main-title love-icon">
            <h1>Better Future For Our Kids</h1>
          </div>
          <div className="sub-title">
            <h3>School Fee payments are now much easier than ever</h3>
          </div>
        </div>
        <div>
          <div className="wrapper hero-section">
            <div className="hero-left-card">
              <img src={girl} alt="girl with book image" className="girl" />
            </div>
            <div className="hero-center">
              <div className="get-started">
                <a
                  href="#"
                  className="btn btn-get_started btn-icon"
                  onClick={showGettingStarted}
                >
                  Get Started
                </a>
              </div>
              <div className="time">
                <span></span>
                <p className="waste-time">
                  Why waste your time on school fee payments while you can pay
                  instantly on WePay&trade;
                </p>
              </div>
              <div className="somek sevenfivek">
                7.5k+
                <p>
                  planning to address <br /> more than7.5k students
                </p>
              </div>
              <div className="arrow-pic"></div>
             
<div className="somek fivehundred">
  500+
  <p>
    planning to address <br /> more than 500 schools
  </p>
</div>
<div className="five-hundred"></div>
</div>
<div className="hero-right">
<div className="hero-right-card">
  <img src={boy} alt="" />
</div>
</div>
</div>
</div>

<section className="full-roles-section">
<div className="wrapper">
<div className="pay-school-fee">
<h3>Pay School Fee</h3>
<p>
  Find your school and your related info and pay your school fee
  in seconds
</p>
<a
  href="#"
  className="btn btn-icon pay-now"
  onClick={handlePayNowClick}
>
  Pay Now
</a>
</div>
<div className="RegisterSchool">
<h3>Register Your School</h3>
<p>
  Follow simple steps to register your school into our system and
  automate future payments
</p>
<a
  href="#"
  className="btn btn-icon add-school"
  onClick={handleAddSchoolClick}
>
  Add School
</a>
</div>
<div className="RegisterStudent">
<h3>Register Student</h3>
<p>Manage student registration with clear and simple steps</p>
<a
  href="#"
  className="btn btn-icon register"
  onClick={handleRegisterStudentClick}
>
  Register
</a>
</div>
</div>
</section>
<div className="help-students wrapper">
{/* <h1>We help students to push dreams to the next step.</h1> */}
</div>
</main>
<div className="footer wrapper">
<div className="quick-links">
<h3>Add Schools</h3>
<p>Students</p>
<p>Sign Up</p>
<p>Home</p>
</div>
<div className="Payments">
<h3>School Fee</h3>
<p>WePay Service Fee</p>
</div>
<div className="contact-us">
<p>Commercial Bank of Ethiopia</p>
<p>contact@WePay.com.et</p>
</div>
</div>
</div>
);
};

export default LandingPage;