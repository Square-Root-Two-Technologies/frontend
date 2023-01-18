import React from "react";
import "./Home.css";
import cloud from "./images/cloud.png";
import rocket from "./images/rocket2.png";

function Home() {
  return (
    <>
      <div className="container-fluid">
        <div className="row firstRow">
          <div className="col-sm cloudContainerContainer">
            <div className="cloudContainer">
              <img src={cloud} alt="" className="cloud" />
              <div className="rain">
                <span className="drop1" />
                <span className="drop2" />
                <span className="drop3" />
                <span className="drop4" />
                <span className="drop5" />
                <span className="drop6" />
                <span className="drop7" />
                <span className="drop8" />
                <span className="drop9" />
                <span className="drop10" />
                <span className="drop11" />
                <span className="drop12" />
                <span className="drop13" />
                <span className="drop14" />
                <span className="drop15" />
              </div>
            </div>
          </div>
          <div className="col-sm earthContainerContainer">
            <div className="earthContainer">
              <div className="earth"></div>
            </div>
          </div>
          <div className="col-sm rocketContainerContainer">
            <div className="rocketContainer">
              <img src={rocket} className="spacecraft" alt="nkjh" />
              <div className="stars">
                <span className="star1"></span>
                <span className="star2"></span>
                <span className="star3"></span>
                <span className="star4"></span>
                <span className="star5"></span>
                <span className="star6"></span>
                <span className="star7"></span>
                <span className="star8"></span>
                <span className="star9"></span>
                <span className="star10"></span>
                <span className="star11"></span>
                <span className="star12"></span>
                <span className="star13"></span>
                <span className="star14"></span>
                <span className="star15"></span>
                <span className="star16"></span>
                <span className="star17"></span>
                <span className="star18"></span>
                <span className="star19"></span>
                <span className="star20"></span>
                <span className="star21"></span>
                <span className="star22"></span>
                <span className="star23"></span>
                <span className="star24"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
