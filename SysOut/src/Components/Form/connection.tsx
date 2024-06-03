import React, { useState, useContext } from "react";
import "./connection.css";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { Alert, Space } from 'antd';

interface AnimatedLoginFormProps {}

const AnimatedLoginForm: React.FC<AnimatedLoginFormProps> = () => {
  const navigate = useNavigate();
  const [isLoginActive, setIsLoginActive] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    confirm: "",
    username: "",
    phone: "",
    gender: "",
    agreement: false,
    cover : "https://fiverr-res.cloudinary.com/images/t_smartwm/t_main1,q_auto,f_auto,q_auto,f_auto/attachments/delivery/asset/0d179c5419e443873ab481f13f8ede3b-1663786813/bot%20guy%20yellow_blue%20version/make-a-roblox-banner-for-your-youtube.jpg",
    picture : "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
  });
  const [guestValue, setGuestValue] = useState("");

  const { setIsAuthenticated, setUsername, setToken } = useContext(
    AuthContext
  ) as {
    setIsAuthenticated: (value: boolean) => void;
    setUsername: (value: string) => void;
    setToken: (value: string) => void;
  };

  const toggleActiveSection = () => {
    setIsLoginActive(!isLoginActive);
  };
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [event.target.name]:
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value,
    });
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form values:", formValues);

    axios
      .post("http://localhost:5000/api/login", {
        username: formValues.username,
        password: formValues.password,
      })
      .then((response) => {
        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true");
        setUsername(formValues.username);
        setToken(response.data.token);
        navigate("/");
      })
      .catch((error) => {
        console.error("Failed to login", error);
        setErrorMessage(error.response.data.error);
      });
  };

  const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form values:", formValues);

    axios
      .post("http://localhost:5000/api/signIn", formValues)
      .then((response) => {
        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true");
        setUsername(formValues.email);
        setToken(response.data.token);
        navigate("/");
      })
      .catch((error) => {
        console.error("Failed to login", error);
        console.log(error);
        setErrorMessage(error.response.data.error);
      });
  };

  const handleGuestSignIn = () => {
    setIsGuest(true);
  };

  const handleGuestInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGuestValue(event.target.value);
  };

  const handleGuestFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Guest value:", guestValue);
    
    axios
      .post("http://localhost:5000/api/signInGuest", {
        username: guestValue,
        email: guestValue + "@guest.com",
        password: "guest",
        phone: "1111111111",
        picture: "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
        cover: "https://c8.alamy.com/compfr/2hb3da7/tampon-en-caoutchouc-noob-grunge-sur-fond-blanc-illustration-vectorielle-2hb3da7.jpg"
      })
      .then((response) => {
        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true");
        setUsername(guestValue);
        setToken(response.data.token);
        navigate("/");
      })
      .catch((error) => {
        console.error("Failed to login", error);
        console.log(error);
        setErrorMessage(error.response.data.error);
      });
  };

  return (
    <div className={`container ${isLoginActive ? "" : "active"}`}>
      {isGuest ? (
        <div className="guest-section">
          <form onSubmit={handleGuestFormSubmit}>
            <input
              type="text"
              placeholder="Guest Name"
              value={guestValue}
              onChange={handleGuestInputChange}
              required
            />
            <button type="submit">Submit as Guest</button>
            <button onClick={() => setIsGuest(false)}>Cancel</button>
          </form>
        </div>
      ) : (
        <div>
          <div className="signup-section">
            <header onClick={toggleActiveSection}>Signup</header>
            <div className="social-buttons">
              <button>
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    const credentialResponseDecoded = jwtDecode(
                      credentialResponse.credential as any
                    );
                    console.log("Google Login Success:", credentialResponse);
                    console.log("Google Login Success:", credentialResponseDecoded);
                    console.log(
                      "Google Login Success:",
                      (credentialResponseDecoded as any).picture
                    );
                    console.log("HEEEELOOOO0");

                    axios
                      .post("http://localhost:5000/api/signIn", {
                        username: (credentialResponseDecoded as any).name,
                        email: (credentialResponseDecoded as any).email,
                        gender: "google client",
                        password: (credentialResponseDecoded as any).sub,
                        phone: "1111111111",
                        picture: (credentialResponseDecoded as any).picture,
                        pfp: "https://c8.alamy.com/compfr/2hb3da7/tampon-en-caoutchouc-noob-grunge-sur-fond-blanc-illustration-vectorielle-2hb3da7.jpg"
                      })
                      .then((response) => {
                        setIsAuthenticated(true);
                        localStorage.setItem("isAuthenticated", "true");
                        setUsername((credentialResponseDecoded as any).name);
                        setToken(response.data.token);
                        navigate("/");
                      })
                      .catch((error) => {
                        if (error.response && error.response.status === 409) {
                          axios
                            .post("http://localhost:5000/api/login", {
                              username: (credentialResponseDecoded as any).name,
                              password: (credentialResponseDecoded as any).sub,
                            })
                            .then((loginResponse) => {
                              setIsAuthenticated(true);
                              localStorage.setItem("isAuthenticated", "true");
                              setUsername((credentialResponseDecoded as any).name);
                              setToken(loginResponse.data.token);
                              navigate("/");
                            })
                            .catch((loginError) => {
                              console.error("Failed to login", loginError);
                              console.log(loginError);
                              console.log("already connected");
                            });
                        } else {
                          console.error("Failed to sign in", error);
                          console.log(error);
                          setErrorMessage(error.response.data.error);
                        }
                      });
                  }}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                />
              </button>
              <button style={{ color: "black" }} onClick={handleGuestSignIn}>
                Continue as guest
              </button>
            </div>
            <div className="separator">
              <div className="line"></div>
              <p>Or</p>
              <div className="line"></div>
            </div>
            <form onSubmit={handleSignIn}>
              <input
                type="text"
                placeholder="Username"
                name="username"
                value={formValues.username}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                placeholder="Email address"
                name="email"
                value={formValues.email}
                onChange={handleInputChange}
                required
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={formValues.password}
                onChange={handleInputChange}
                required
              />
              <input
                type="password"
                placeholder="Confirm password"
                name="confirm"
                value={formValues.confirm}
                onChange={handleInputChange}
                required
              />
              <input
                type="tel"
                placeholder="Phone number"
                name="phone"
                value={formValues.phone}
                onChange={handleInputChange}
                required
              />
              <input
                type="gender"
                placeholder="What are u ?"
                name="gender"
                onChange={handleInputChange}
                required
              />
              <div className="agreement">
                <input
                  type="checkbox"
                  name="agreement"
                  checked={formValues.agreement}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="agreement">
                  I accept the <a href="#">Terms of Use</a> &amp;{" "}
                  <a href="#">Privacy Policy</a>
                </label>
              </div>
              <a href="#">Forget Password?</a>
              <button type="submit" className="btn-signin">
                Signup
              </button>
            </form>
          </div>


          <div className="login-section">
            <header onClick={toggleActiveSection}>Login</header>
            <div className="social-buttons">
              <button>
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    const credentialResponseDecoded = jwtDecode(
                      credentialResponse.credential as any
                    );
                    console.log("Google Login Success:", credentialResponse);
                    console.log("Google Login Success:", credentialResponseDecoded);
                    console.log(
                      "Google Login Success:",
                      (credentialResponseDecoded as any).email
                    );

                    axios
                      .post("http://localhost:5000/api/login", {
                        username: (credentialResponseDecoded as any).name,
                        password: (credentialResponseDecoded as any).sub,
                      })
                      .then((loginResponse) => {
                        setIsAuthenticated(true);
                        localStorage.setItem("isAuthenticated", "true");
                        setUsername((credentialResponseDecoded as any).name);
                        setToken(loginResponse.data.token);
                        navigate("/");
                      })
                      .catch((error) => {
                        console.log(error);
                        setErrorMessage(error.response.data.error);
                      });
                  }}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                />
              </button>
            </div>
            <div className="separator">
              <div className="line"></div>
              <p>Or</p>
              <div className="line"></div>
            </div>
            <form onSubmit={handleLogin}>
              <input
                type="username"
                placeholder="Username"
                name="username"
                value={formValues.username}
                onChange={handleInputChange}
                required
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={formValues.password}
                onChange={handleInputChange}
                required
              />
              <a href="#">Forget Password?</a>
              <button type="submit" className="btn-login">
                Login
              </button>
              {errorMessage && <Alert message={errorMessage} type="error" />}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimatedLoginForm;
