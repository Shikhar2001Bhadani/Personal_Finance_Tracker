import React from 'react'
import cards from "../assets/cards.svg";
function NoTransactions() {
  return (
    <div
      style={{
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        width:"100%",
        flexDirection:"column",
        marginBottom:"2rem",
      }}
    >
        <img src={cards}style={{width:"400px",margin:"4rem"}}/>
        <p style={{textAlign:"center",fontSize:"1.2rem"}}>
            LOADING
        </p>
        </div>
  )
}

export default NoTransactions
