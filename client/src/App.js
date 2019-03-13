import React, { Component } from "react";
import { withRouter } from "react-router";
import { Route, Switch } from "react-router-dom";
import { NewSession } from "./components/Session";
import "./App.css";
import Welcome from "./views/Welcome";
import Overlay from "./views/Overlay";
import Dashboard from "./views/Dashboard";
import axios from "axios";
require("dotenv").config();

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sessionKey: null,
      tournamentSlug: null,
      userName: "Guest",
      streamIndex: 0,
      isLive: true,
      sessionData: null
    };
  }

  componentWillMount() {
    this.init();
  }

  componentDidMount() {
    this.timer = null;
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  /**
   * 
   * 
   * TODO: Match info goes to database, not client state
   * so if multiple windows being used for same tourney
   * we don't query smash.gg a million times and get errors
   * 
   * 
   * 
   */

  init() {
    let path = this.props.history.location.pathname.substring(1);
    let loc = path.indexOf("/");
    let sessionString = null;
    let streamIndex = 0;
    if (loc < 0) {
      sessionString = path;
    } else {
      sessionString = path.slice(0, loc);
    }
    let tryStreamIndex = path.slice(
      sessionString.length + 1,
      sessionString.length + 2
    );
    if (
      tryStreamIndex.length === 1 &&
      tryStreamIndex !== this.state.streamIndex
    ) {
      streamIndex = tryStreamIndex;
    }
    if (sessionString.length > 3) {
      axios.get(`/api/sessions/${sessionString}`).then(res => {
        let data = res.data;
        if (data) {
          this.timer = setInterval(this.getStreamInfo.bind(this), 5000, data);
          this.setState({ sessionData: data, sessionKey: sessionString, streamIndex: streamIndex, tournamentSlug: data.tournamentSlug })
        } else {
          console.log("Session not found");
        }
      });
    }
  }

  /**
   *
   * @param {string} key session name
   * Sets the client state of session name to reflect the server & pushes to path
   * Called from Welcome
   */
  setSession(key) {
    this.setState({ sessionKey: key.key });
    window.location.replace("/" + key.key);
  }

  /**
   *
   * @param {integer} index smash.gg StreamQueue stream index
   * Updates Dashboard and client state to reflect selected stream
   * Called from Dashboard
   */
  setStream(index) {
    this.setState({ streamIndex: index });
    this.props.history.push("/" + this.state.sessionKey + "/" + index);
  }

  setLive(x) {
    this.setState({ isLive: x });
  }

  /**
   *
   * @param {string} tourneyId smash.gg tournament name
   * TODO: Validate that the tourney exists
   * Adds the ID of the smash.gg tournament to Session DB entry
   * Called by Welcome on initial tourney add
   */
  smashValidate(tourneyId) {
    axios
      .post(`/api/sessions/${this.state.sessionKey}/updateTournament`, {
        tournamentSlug: tourneyId
      })
      .catch(err => console.log(err));
      this.forceUpdate();
  }


  /**
   *
   * @param {string} id smash.gg tourney slug
   * Updates client with StreamQueue info from smash.gg
   */
  getStreamInfo() {
    axios.get(`/api/sessions/${this.state.sessionKey}`).then(res => {
      let data = res.data;
      if (data) {
        if (this.timer === null) {
          this.timer = setInterval(this.getStreamInfo.bind(this), 5000, data);
        }
          this.setState({ sessionData: data })
      } else {
        console.log("Session not found");
      }
    });
  }


  /**
   * Main render function
   */
  render() {
    let NoMatch = () => {
      return (
       <div></div>
      );
    };
    /**
     * This is called if the URL doesnt match a path
     * Tries to find a session with a name that matches URL
     * TODO: If not, do something
     */
    return (
      <div>
        <Switch>
          <Route
            exact
            path="/"
            render={props => (
              <Welcome
                {...props}
                sessionData={this.state.sessionData}
                sessionKey={this.state.sessionKey}
                smashValidate={id => this.smashValidate(id)}
              />
            )}
          />
          <Route
            exact
            path={"/" + this.state.sessionKey}
            render={props => (
              <Dashboard
                {...props}
                setStream={x => this.setStream(x)}
                streamIndex={this.state.streamIndex}
                isLive={this.state.isLive}
                setLive={x => this.setLive(x)}
                smashValidate={id => this.smashValidate(id)}
                tournamentSlug={this.state.tournamentSlug}
                sessionData={this.state.sessionData}
              />
            )}
          />
          <Route
            exact
            path={"/" + this.state.sessionKey + "/" + this.state.streamIndex}
            render={props => (
              <Dashboard
                {...props}
                setStream={x => this.setStream(x)}
                streamIndex={this.state.streamIndex}
                isLive={this.state.isLive}
                setLive={x => this.setLive(x)}
                smashValidate={id => this.smashValidate(id)}
                tournamentSlug={this.state.tournamentSlug}
                sessionData={this.state.sessionData}
              />
            )}
          />
          <Route
            exact
            path="/create"
            render={props => (
              <NewSession {...props} setSession={key => this.setSession(key)} />
            )}
          />
          <Route
            exact
            path={
              "/" +
              this.state.sessionKey +
              "/" +
              this.state.streamIndex +
              "/scoreboard"
            }
            render={props => (
              <Overlay
                {...props}
                sessionData={this.state.sessionData}
                streamIndex={this.state.streamIndex}
                edit={false}
                key={"overlay"}
              />
            )}
          />
          <Route
            exact
            path={
              "/" +
              this.state.sessionKey +
              "/" +
              this.state.streamIndex +
              "/scoreboard/edit"
            }
            render={props => (
              <Overlay
                {...props}
                sessionData={this.state.sessionData}
                streamIndex={this.state.streamIndex}
                edit={true}
              />
            )}
          />
          <Route component={NoMatch} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
