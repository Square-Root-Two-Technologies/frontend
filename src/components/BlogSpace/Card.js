import React from "react";
import "./Card.css";

const Card = (props) => (
  <div className="blogCard">
    <div className="blogContainer">
      <h4>
        <b>{props.data.title}</b>
      </h4>
      <p>{props.data.description}</p>
    </div>
  </div>
);

export default Card;
