import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import useClickAway from "../hooks/useClickAway";
import useKeyToClose from "../hooks/useKeyToClose";
import { setPopup, setPopupType } from "../features/popups/popupSlice";
import CbeLogoSmall from "./LandingPage/images/cbe2.svg";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo/Logo";
import { FaUser } from "react-icons/fa";
import { register, reset } from "../features/auth/authSlice";
import Spinner from "../components/Utilities/Progress/Spinner";
import "./Login/loginStyless.css";

// 1. Validation constants (SRP)
const VALIDATION = {
  USER_REGEX: /^[a-zA-Z][a-zA-z0-9-_]{3,23}$/,
  PWD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/,
  EMAIL_REGEX: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  ERROR_MESSAGES: {
    USERNAME: "Username must be 4-24 characters. Must begin with a letter. Letters, numbers, underscores, hyphens allowed.",
    EMAIL: "Must be a valid email address. Existing email address preferred.",
    PASSWORD: "Password must be 8-24 characters with uppercase, lowercase, number, and special character (!@#$%).",
    MATCH: "Confirm password must match the first password input field."
  }
};

// 2. Custom hook for form validation (SRP)
const useFormValidation = () => {
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
    validName: false,
    validEmail: false,
    validPwd: false,
    validMatch: false,
    nameFocus: false,
    emailFocus: false,
    pwdFocus: false,
    matchFocus: false
  });

  useEffect(() => {
    const validName = VALIDATION.USER_REGEX.test(state.name);
    const validEmail = VALIDATION.EMAIL_REGEX.test(state.email);
    const validPwd = VALIDATION.PWD_REGEX.test(state.password);
    const validMatch = state.password === state.password2;

    setState(prev => ({
      ...prev,
      validName,
      validEmail,
      validPwd,
      validMatch
    }));
  }, [state.name, state.email, state.password, state.password2]);

  return [state, setState];
};

// 3. Error Message Component (SRP)
const ErrorMessage = ({ condition, message }) => (
  <p className={condition ? "errMsg" : "offscreen"} aria-live="assertive">
    {message}
  </p>
);

// 4. Reusable Form Input Component (OCP/SRP)
const FormInput = ({
  type,
  id,
  value,
  placeholder,
  valid,
  focus,
  onFocus,
  onBlur,
  onChange,
  ariaInvalid,
  ariaDescribedby
}) => (
  <div className="form-group">
    <input
      type={type}
      id={value ? id : `idle-${id}`}
      className={valid ? "valid" : "invalid"}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      aria-invalid={ariaInvalid}
      aria-describedby={ariaDescribedby}
    />
  </div>
);

function Register() {
  const [state, setState] = useFormValidation();
  const [errMsg, setErrMsg] = useState("");
  const [someMessage, setMessage] = useState("");
  const userRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const registerRef = useRef();

  // 5. Redux state management (SRP)
  const { user, isLoading, isError, isSuccess, message: authMessage } = useSelector(
    (state) => state.auth
  );
  const { popup } = useSelector((state) => state.popups);

  // 6. Side effects (SRP)
  useEffect(() => {
    if (isError) {
      setMessage(authMessage);
      setErrMsg(authMessage);
    }
    if (isSuccess || user) {
      dispatch(setPopupType(""));
      navigate("/");
    }
    dispatch(reset());
  }, [user, isError, isSuccess, authMessage, navigate, dispatch]);

  useEffect(() => {
    if (state.nameFocus || state.emailFocus || state.pwdFocus || state.matchFocus) {
      setMessage("");
    }
  }, [state.nameFocus, state.emailFocus, state.pwdFocus, state.matchFocus]);

  // 7. Event handlers (SRP)
  const showLogin = useCallback(() => {
    dispatch(setPopup(!popup));
    dispatch(setPopupType("Login"));
  }, [dispatch, popup]);

  const handleInputChange = (field) => (e) => {
    setState(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleFocus = (field) => () => {
    setState(prev => ({ ...prev, [`${field}Focus`]: true }));
  };

  const handleBlur = (field) => () => {
    setState(prev => ({ ...prev, [`${field}Focus`]: false }));
  };

  const allFormFieldsAreValid = useCallback(
    () => state.validName && state.validPwd && state.validEmail && state.validMatch,
    [state.validName, state.validPwd, state.validEmail, state.validMatch]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(authMessage);

    if (allFormFieldsAreValid()) {
      dispatch(register({
        name: state.name,
        email: state.email,
        password: state.password,
        roles: 2001,
        secretKey: "yitopretrtyio0594-yopiyr0954"
      }));
    }
  };

  useClickAway(registerRef, () => {});
  useKeyToClose("Escape", () => {});

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="account-container flex-ccc">
      <div ref={registerRef} className="account-sub-container flex-ccc">
        <section className="heading">
          <div className="flex-c">
            <Logo />
          </div>
          <h1 className="gradient__text">Sign Up</h1>
        </section>
        <section className="form">
          <form onSubmit={handleSubmit} className="account-form-group">
            <ErrorMessage
              condition={errMsg}
              message={someMessage}
            />

            <FormInput
              type="text"
              id="name"
              value={state.name}
              placeholder="User name"
              valid={state.validName}
              focus={state.nameFocus}
              onChange={handleInputChange("name")}
              onFocus={handleFocus("name")}
              onBlur={handleBlur("name")}
              ariaInvalid={!state.validName}
              ariaDescribedby="name"
            />

            <FormInput
              type="email"
              id="email"
              value={state.email}
              placeholder="Email"
              valid={state.validEmail}
              focus={state.emailFocus}
              onChange={handleInputChange("email")}
              onFocus={handleFocus("email")}
              onBlur={handleBlur("email")}
              ariaInvalid={!state.validEmail}
              ariaDescribedby="email"
            />

            <FormInput
              type="password"
              id="password"
              value={state.password}
              placeholder="Password"
              valid={state.validPwd}
              focus={state.pwdFocus}
              onChange={handleInputChange("password")}
              onFocus={handleFocus("pwd")}
              onBlur={handleBlur("pwd")}
              ariaInvalid={!state.validPwd}
              ariaDescribedby="password"
            />

            <FormInput
              type="password"
              id="password2"
              value={state.password2}
              placeholder="Confirm password"
              valid={state.validMatch}
              focus={state.matchFocus}
              onChange={handleInputChange("password2")}
              onFocus={handleFocus("match")}
              onBlur={handleBlur("match")}
              ariaInvalid={!state.validMatch}
              ariaDescribedby="password2"
            />

            <div className="form-error-sectiona">
              <ErrorMessage
                condition={state.nameFocus && !state.validName && state.name}
                message={VALIDATION.ERROR_MESSAGES.USERNAME}
              />
              <ErrorMessage
                condition={state.emailFocus && !state.validEmail && state.email}
                message={VALIDATION.ERROR_MESSAGES.EMAIL}
              />
              <ErrorMessage
                condition={state.pwdFocus && !state.validPwd && state.password}
                message={VALIDATION.ERROR_MESSAGES.PASSWORD}
              />
              <ErrorMessage
                condition={state.matchFocus && !state.validMatch && state.password2}
                message={VALIDATION.ERROR_MESSAGES.MATCH}
              />
            </div>

            <button
              className={allFormFieldsAreValid() ? "btn-valid" : "btn-signup"}
              type="submit"
            >
              Sign Up
            </button>

            <p className="sign-in already flex-c">
              Already Registered?{" "}
              <button type="button" className="sign-i" onClick={showLogin}>
                Sign In
              </button>
            </p>

            <p className="terms">
              By signing up you agree to We School Fee{" "}
              <a href="#" className="terms-a">
                <u>terms and conditions</u>
              </a>
            </p>
          </form>
          <img src={CbeLogoSmall} alt="CBE Logo" />
        </section>
      </div>
    </div>
  );
}

export default Register;