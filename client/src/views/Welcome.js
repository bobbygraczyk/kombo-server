import React, { Component } from "react";
import "../App.css";
import { CreateSession } from "../components/Session";

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      field: "capitals-esports-faceoff"
    };
  }
  render() {
      return (
        <div className="welcome">
          <span>
            <h1>kombo</h1>
          </span>
          <CreateSession />
        </div>
      );
    }
}

export default Welcome;
