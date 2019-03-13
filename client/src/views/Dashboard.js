import React, { Component } from "react";
import Twitch from "../components/Twitch";
import Chat from "./Chat.js";
import "../App.css";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      field: "tourney slug",
      loading: false
    };
  }

  inputChange(e) {
    this.setState({
      field: e.target.value
    });
  }

  getStreamButtons() {
    let buttons = [];
    let color = "#9c699c";
    let bottomBorder = "2px solid grey";
    let fontColor = "white";
    let height = "24px";
    if (this.props.sessionData.streamInfo.streamQueue) {
      for (
        let i = 0;
        i < this.props.sessionData.streamInfo.streamQueue.length;
        i++
      ) {
        if (this.props.streamIndex === i) {
          color = "#eae2e2";
          bottomBorder = "0px";
          height = "26px";
          fontColor = "black";
        } else {
          color = "#a41318";
          bottomBorder = "2px solid black";
          height = "24px";
          fontColor = "white";
        }
        buttons.push(
          <button
            key={i}
            style={{
              backgroundColor: color,
              borderBottom: bottomBorder,
              height: height,
              color: fontColor
            }}
            onClick={() => {
              this.props.setStream(i);
            }}
          >
            {this.props.sessionData.streamInfo.streamQueue[i].stream.streamName}
          </button>
        );
      }
      return buttons;
    } else {
      return "No stream information";
    }
  }

  getStreamQueue() {
    let queue = [];
    if (this.props.sessionData.streamInfo.streamQueue) {
      for (
        let i = 1;
        i <
        this.props.sessionData.streamInfo.streamQueue[this.props.streamIndex]
          .sets.length;
        i++
      ) {
        queue.push(
          <React.Fragment>
            {this.props.sessionData.streamInfo.streamQueue[
              this.props.streamIndex
            ].sets[i].slots[0].entrant !== null
              ? this.props.sessionData.streamInfo.streamQueue[
                  this.props.streamIndex
                ].sets[i].slots[0].entrant.name
              : "No entrant in slot"}
            {" "}vs{" "}
            {this.props.sessionData.streamInfo.streamQueue[
              this.props.streamIndex
            ].sets[i].slots[1].entrant !== null
              ? this.props.sessionData.streamInfo.streamQueue[
                  this.props.streamIndex
                ].sets[i].slots[1].entrant.name
              : "No entrant in slot"}
              <br />
          </React.Fragment>
        );
      }
      return queue;
    } else {
      return "No stream information";
    }
  }

  render() {
    let tourneyName = "Test Mode";
    let playerOneName = "Test1";
    let playerTwoName = "Test2";
    const ConnectToSmash = () => {
      return (
        <div className="welcome">
          <span>
            <h1>kombo</h1>
          </span>
          <div>
          Connect to Smash.gg
          <br />
          <input
            onChange={x => this.inputChange(x)}
            value={this.state.field}
            type="text"
          />
          <button
            onClick={() => {
              this.props.smashValidate(this.state.field);
              this.setState({ loading: true });
            }}
          >
            Connect
          </button>
          <br />
          {this.state.loading ? "Loading" : ""}
        </div>
        </div>
      );
    };
    if (this.props.sessionData) {
      if (this.props.sessionData.streamInfo) {
        if (
          this.props.isLive &&
          this.props.sessionData.streamInfo.streamQueue
        ) {
          tourneyName = this.props.sessionData.tournamentName;
          playerOneName =
            this.props.sessionData.streamInfo.streamQueue[
              this.props.streamIndex
            ].sets[0].slots[0].entrant !== null
              ? this.props.sessionData.streamInfo.streamQueue[
                  this.props.streamIndex
                ].sets[0].slots[0].entrant.name
              : "No entrant in slot";
          playerTwoName =
            this.props.sessionData.streamInfo.streamQueue[
              this.props.streamIndex
            ].sets[0].slots[1].entrant !== null
              ? this.props.sessionData.streamInfo.streamQueue[
                  this.props.streamIndex
                ].sets[0].slots[1].entrant.name
              : "No entrant in slot";
        }
        const Header = () => {
          return (
            <div className="dashboard-header">
              <h2>{tourneyName}</h2>
              <div id="buttons">
                {this.props.isLive
                  ? this.getStreamButtons()
                  : "Go live to see streams"}
              </div>
              <div className="logo">kombo</div>
              {/* <button
              id="liveButton"
              style={{ backgroundColor: this.props.isLive ? "green" : "red" }}
              onClick={() =>
                this.props.isLive
                  ? this.props.setLive(false)
                  : this.props.setLive(true)
              }
            >
              {this.props.isLive ? "Live" : "Test"}
            </button> */}
            </div>
          );
        };
        const Queue = () => {
          return (
            <div className="dashboard-queue" id="flexbox-half-height">
              <div className="panel-top-bar">Queue</div>
              <div className="currentSet">
                <h2>Current Set:</h2>
                <small>{playerOneName}</small><small> vs. </small>
                <small>{playerTwoName}</small><br />
                <h4>Round Name</h4>
              </div>
              <div className="next-up">
              <h3>Next up:</h3>
                {this.props.isLive
                  ? this.getStreamQueue()
                  : "Go live to see queue"}
              </div>
            </div>
          );
        };
        const Control = () => {
          return (
            <div className="control" id="flexbox-half-height">
              <div className="panel-top-bar">Control</div>
              <h4>TODO: edit overlay links & OBS control</h4>
            </div>
          );
        };
        return (
          <React.Fragment>
            <Header />
            <div className="flexbox-wrapper">
              <Queue />
              <Control />
              <Twitch
                sessionData={this.props.sessionData}
                streamIndex={this.props.streamIndex}
                isLive={this.props.isLive}
              />
              <Chat sessionData={this.props.sessionData} />
            </div>
          </React.Fragment>
        );
      } else {
        return (
          <div>
            <ConnectToSmash />
          </div>
        );
      }
    }
  }
}

export default Dashboard;
