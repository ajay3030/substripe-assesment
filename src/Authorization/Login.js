import React, { useEffect, useState } from "react";
import "../Styles/Login.css";
import axios from "axios";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function Login() {
  // initial state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState(false);
  const [message,setMessage] = useState("Kindly Login to Proceed")
  const handleSubmit = (e) => {
    e.preventDefault();
    const configuration = {
      method: "post",
      url: "/login",
      data: {
        email,
        password,
      },
    };
    axios(configuration)
      .then((result) => {
        cookies.set("TOKEN", result.data.token, {
          path: "/",
        });
        cookies.set("billing_id",result.data.billing_id,{path:'/'})
        window.location.href = "/";
        setLogin(true);
      })
      .catch((error) => {
        console.log(error)
        setMessage(error.message)
      });
  };
  const redirect = () => {
    window.location.href = "/";
  };
  useEffect(() => {
    const token = cookies.get("TOKEN");
    if (token != null) {
      redirect();
    }
  }, []);
  return (
    <>
      <div className="parent-div">
        {/* <div className="form-card"> */}
        <form onSubmit={(e) => handleSubmit(e)} className="form-card" >
          <h2>
            <i>Substripe</i>
          </h2>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your registered email"
            className="form-input"
            autoComplete="on"
          />
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="form-input"
            autoComplete="on"
          />
          <button
            variant="primary"
            type="submit"
            onClick={(e) => handleSubmit(e)}
            className="form-btn"
          >
            Login
          </button>
          {login ? (
            <p className="text-success">You Are Logged in Successfully</p>
          ) : (
            <p className="text-info">{message}</p>
          )}
          <span className="text-detail">
            Don't have an account?<a href="/register" className="a-link"> Register</a>
          </span>
        </form>
      </div>
      {/* </div> */}
    </>
  );
}
