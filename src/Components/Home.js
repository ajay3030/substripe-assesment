import React, { useEffect, useState } from "react";
import "../Styles/Home.css";
import axios from "axios";
import Cookies from "universal-cookie";
const cookies = new Cookies();
const token = cookies.get("TOKEN");

const Home = () => {
  const [user, setUser] = useState({});
  const [activePlan, setActivePlan] = useState({});
  const [sessionId, setSessionId] = useState({});
  const [loading,setLoading] = useState(true);
  useEffect(() => {
    const configuration = {
      method: "get",
      url: "/get-user-data",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios(configuration)
      .then((result) => {
        setUser(result.data);
      })
      .catch((error) => {
        error = new Error();
      });
      const cusId = user.billing_id;
      const configuration1 = {
        method: "post",
        headers: {}, 
        url: "/get-subscription-sessions",
        data: {cusId},
      };
      axios(configuration1)
        .then((result) => {
          setSessionId(result.data['data']);
        })
        .catch((error) => {
          error = new Error();
        });
        const configuration2 = {
          method: "post",
          headers: {}, 
          url: "/get-subscription-data",
          data: {cusId},
        };
        axios(configuration2)
          .then((result) => {
            setActivePlan(result.data);
            setLoading(false);
          })
          .catch((error) => {
            error = new Error();
          });
        //eslint-disable-next-line
  }, []);

  const logout = () => {
    cookies.remove("TOKEN", { path: "/" });
    window.location.href = "/login";
  };

  if(loading){
    return(
      <>
      <div className="home-container">
        <div className="loader"></div>
      </div>
      </>
    );
  }else{
    return (
      <div className="home-container">
        <div className="header">
          <div className="header-left">
            <h2 className="margin-none"><i>Substripe</i></h2>
          </div>
          <div className="header-right">
            <button type="submit" onClick={() => logout()} className="form-btn">
              Logout
            </button>
          </div>
        </div>
        <div className="user-card">
          <div className="user-name">
            {`Welcome, ${user.username}`}
          </div>
          <div className="active-subs"> 
            Subscription: 
               {activePlan.data.length===0?
               <span className="inactive">Not Subscribed</span>
               :<span className="active">Active</span>}
          </div>
          <div className="manage-sub">
          {activePlan.data.length ===0?
            <button type="submit" onClick={() =>{ window.location.href = '/subscribe';}} className="form-btn">
              Subscribe
            </button>:
             <form action="/create-portal-session" method="POST">
             <input
               type="hidden"
               id="session-id"
               name="session_id"
               value={sessionId.length>=1?sessionId[0].id:''}
               autoComplete="on"
             />
             <button className="cancel-btn" type="submit">
               Cancel Subscription
             </button>
           </form>
          }
          </div>
        </div>
      </div>
    );
  }
};
export default Home;
