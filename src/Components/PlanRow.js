import React from "react";

const PlanRow = ({ plan,setSelectedPlan,selectedPlan }) => {
  return (
    <>
      <div className={`plan-row ${plan.type === selectedPlan.type? 'plan-selected' :''}`} onClick={()=>{setSelectedPlan(plan)}}>
        <div className="plan-col">{plan.type}</div>
        <div className="plan-col">{plan.price}</div>
        <div className="plan-col">{plan.quality}</div>
        <div className="plan-col">{plan.res}</div>
        <div className="plan-col">{plan.devices.map((text,i)=>{return <span key={i}>&nbsp;{text}</span>})}</div>
      </div>
    </>
  );
};

export default PlanRow;
