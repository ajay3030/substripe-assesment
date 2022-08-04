import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/Subscribe.css";
import PlanRow from "./PlanRow";
import Cookies from "universal-cookie"
const cookies = new Cookies();

const Subscribe = () => {
  const [data, setData] = useState({});
  const [keySelect, setKeySelect] = useState("monthly");
  const [selectedPlan,setSelectedPlan] = useState({});
  
  
  useEffect(() => {
    const configuration = {
      method: "get",
      url: "/subscriptionData",
    };
    axios(configuration)
      .then((result) => {
        setData(result.data[0]);
      })
      .catch((error) => {
        error = new Error();
      });
  }, []);

  const billing_id = cookies.get("billing_id");
  const jData={
    "lookup_key": selectedPlan.id,
    "billing_id": billing_id
  }
  const checkout=()=>{
    const configuration = {
        method: "post",
        url: "/create-checkout-session",
        data: jData
      };
      axios(configuration)
        .then((result) => {
           window.location.href = result.data;
        })
        .catch((error) => {
          error = new Error();
        });
  }

  return (
    <>
      <div className="parent">
      <div className="subscription-container">
        <div className="subscription-content">
            <div className="subscription-head">
                <a href="/" className="a-link">Go Home</a>
                <h1>Choose the plan that's right for you</h1>
                <h3>You can cancel anytime</h3>
            </div>
            <div className="subscription-body">
                <div className="subscription-cycle">
                    <div className={`cycle-button ${keySelect==="monthly"? 'selected' :''}`} onClick={()=>{setKeySelect('monthly');setSelectedPlan({})}}>
                        Monthly
                    </div>
                    <div className={`cycle-button ${keySelect==="yearly"? 'selected' :''}`} onClick={()=>{setKeySelect('yearly');setSelectedPlan({})}}>
                        Yearly
                    </div>
                </div>
                <div className="subscription-plans">
                    <div className="plan-header">
                        <div className="plan-label">Plan Name</div>
                        <div className="plan-label">Price</div>
                        <div className="plan-label">Quality</div>
                        <div className="plan-label">Resolution</div>
                        <div className="plan-label">Deivces</div>
                    </div>
                    {data[keySelect]!==undefined?data[keySelect].map((plan,i)=>{
                        return(
                               <PlanRow plan={plan} key={i} setSelectedPlan={setSelectedPlan} selectedPlan={selectedPlan}/>
                        )   
                    }):""}
                </div>
                <button className="subscription-btn" onClick={()=>{checkout()}}>Next</button>
            </div>
        </div>
    </div>
      </div>
    </>
  );
};

export default Subscribe;
