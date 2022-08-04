import React, { useState } from "react";
import '../Styles/Login.css'
import axios from "axios";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [register, setRegister] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    const configuration = {
      method: "post",
      url: "/register",
      data: {
        email,
        username,
        password,
      },
    };
    axios(configuration)
      .then((result) => {
        window.location.href ='/login'
        setRegister(true);
      })
      .catch((error) => {
        error = new Error();
      });
  };

  return (
    <>
    <div className="parent-div">
        {/* <div className="form-card"> */}
        <form onSubmit={(e) => handleSubmit(e)} className="form-card" style={{justifyContent:'flex-start'}}>
          <h2><i>Substripe</i></h2>
          {register ? (
            <p className="text-success">You Are registered Successfully</p>
          ) : (
            <p className="text-info">Welcome , Fill your details to join us!</p>
          )}
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your Full Name"
            className="form-input"
            autoComplete="on"
          />
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="form-input"
            autoComplete="on"
          />
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            className="form-input"
            autoComplete="on"
          />
          <button
            variant="primary"
            type="submit"
            onClick={(e) => handleSubmit(e)}
            className="form-btn"
          >
            Register
          </button>
          <span className="text-detail">
            Already have an account?<a href="/login" className="a-link"> Login</a>
          </span>
        </form>
        </div>
      {/* </div> */}
    </>
  );
}
