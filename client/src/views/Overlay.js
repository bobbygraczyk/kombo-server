import React, { Component } from "react";
import axios from "axios";
import "../App.css";

class Overlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scoreboardType: "fighting-game",
      fields: null
    };
  }

  componentWillMount() {
    if (!this.state.fields) {
      this.setState({ fields: this.props.sessionData.streamLayout[0] });
    }
  }

  componentWillUpdate() {
    if (
      !this.props.edit &&
      JSON.stringify(this.state.fields) !==
        JSON.stringify(this.props.sessionData.streamLayout[0])
    ) {
      this.setState({ fields: this.props.sessionData.streamLayout[0] });
    }
  }
  inputChange(e, type, prop) {
    this.setState({
      fields: {
        ...this.state.fields,
        [type]: {
          ...this.state.fields[type],
          [prop]: e.target.value
        }
      }
    });
  }

  EditPanel = () => {
    if (this.props.edit && this.state.fields) {
      return (
        <div className="edit-panel">
          Edit Layout
          <br />
          <small>Please use color names or hex values for color field</small>
          <table>
            <thead>
            <tr>
              <th>Name</th>
              <th>Score</th>
              <th>Round</th>
              <th>Event</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>
                Color: <br />
                <input
                  key={0}
                  onChange={x => this.inputChange(x, "name", "color")}
                  value={this.state.fields.name.color}
                  type="text"
                />
              </td>
              <td>
                Color: <br />
                <input
                  key={1}
                  onChange={x => this.inputChange(x, "score", "color")}
                  value={this.state.fields.score.color}
                  type="text"
                />
              </td>
              <td>
                Color: <br />
                <input
                  key={2}
                  onChange={x => this.inputChange(x, "round", "color")}
                  value={this.state.fields.round.color}
                  type="text"
                />
              </td>
              <td>
                Color: <br />
                <input
                  key={3}
                  onChange={x => this.inputChange(x, "event", "color")}
                  value={this.state.fields.event.color}
                  type="text"
                />
              </td>
            </tr>
            <tr>
              <td>
                Size: <br />
                <input
                  key={4}
                  onChange={x => this.inputChange(x, "name", "fontSize")}
                  value={this.state.fields.name.fontSize}
                  type="text"
                />
              </td>
              <td>
                Size: <br />
                <input
                  key={5}
                  onChange={x => this.inputChange(x, "score", "fontSize")}
                  value={this.state.fields.score.fontSize}
                  type="text"
                />
              </td>
              <td>
                Size: <br />
                <input
                  key={6}
                  onChange={x => this.inputChange(x, "round", "fontSize")}
                  value={this.state.fields.round.fontSize}
                  type="text"
                />
              </td>
              <td>
                Size: <br />
                <input
                  key={7}
                  onChange={x => this.inputChange(x, "event", "fontSize")}
                  value={this.state.fields.event.fontSize}
                  type="text"
                />
              </td>
            </tr>
            <tr>
              <td>
                Height: <br />
                <input
                  key={8}
                  onChange={x => this.inputChange(x, "name", "top")}
                  value={this.state.fields.name.top}
                  type="text"
                />
              </td>
              <td>
                Height: <br />
                <input
                  key={9}
                  onChange={x => this.inputChange(x, "score", "top")}
                  value={this.state.fields.score.top}
                  type="text"
                />
              </td>
              <td>
                Height: <br />
                <input
                  key={10}
                  onChange={x => this.inputChange(x, "round", "top")}
                  value={this.state.fields.round.top}
                  type="text"
                />
              </td>
              <td>
                Height: <br />
                <input
                  key={11}
                  onChange={x => this.inputChange(x, "event", "top")}
                  value={this.state.fields.event.top}
                  type="text"
                />
              </td>
            </tr>
            <tr>
              <td>
                Width: <br />
                <input
                  key={12}
                  onChange={x => this.inputChange(x, "name", "width")}
                  value={this.state.fields.name.width}
                  type="text"
                />
              </td>
              <td>
                Width: <br />
                <input
                  key={13}
                  onChange={x => this.inputChange(x, "score", "width")}
                  value={this.state.fields.score.width}
                  type="text"
                />
              </td>
            </tr>
            </tbody>
          </table>
          <button onClick={() => this.save()}>Save</button>
          <button onClick={() => this.reset()}>Reset</button>
        </div>
      );
    } else {
      return "";
    }
  };

  save() {
    axios
      .post(
        `/api/sessions/${this.props.sessionData.key}/scoreboard`,
        this.state.fields
      )
      .catch(err => console.log(err));
  }
  reset() {
    this.setState({ fields: this.props.sessionData.streamLayout[0] });
  }
  render() {
    if (this.props.sessionData.streamInfo && this.state.fields) {
      return (
        <div className="scoreboard">
          <this.EditPanel />
          <div
            style={{ top: this.state.fields.name.top }}
            className="container"
          >
            <table style={this.state.fields.name}>
                <tbody>
              <tr>
                <td id="one">
                  {
                    this.props.sessionData.streamInfo.streamQueue[
                      this.props.streamIndex
                    ].sets[0].slots[0].entrant.name
                  }
                </td>
                <td id="two">
                  {
                    this.props.sessionData.streamInfo.streamQueue[
                      this.props.streamIndex
                    ].sets[0].slots[1].entrant.name
                  }
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <div
            style={{ top: this.state.fields.score.top }}
            className="container"
          >
            <table style={this.state.fields.score}>
            <tbody>
              <tr>
                <td id="one">0</td>
                <td id="two">0</td>
              </tr>
              </tbody>
            </table>
          </div>
          <div style={this.state.fields.round} className="container">
            Round Name
          </div>
          <div style={this.state.fields.event} className="container">
            Event Name
          </div>
        </div>
      );
    } else {
      return (
        <div className="scoreboard">
          <p id="player-one-name">Player One</p>
          <p id="round">Round Name</p>
          <p id="player-two-name">Player Two</p>
        </div>
      );
    }
  }
}

export default Overlay;
