import React, { Component } from "react";
import "../App.css";
import axios from "axios";

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      field: "Message",
      scrolled: false
    };
    this.chatRef = React.createRef();
    this.chatFieldRef = React.createRef();
  }
  postMessage() {
    axios.post(`/api/sessions/${this.props.sessionData.key}/messages`, {
      user: "Guest",
      body: this.state.field,
      date: new Date()
    });
    this.setState({ field: "" });
  }
  getMessages() {
    let messages = [];
    for (let i = 0; i < this.props.sessionData.messages.length; i++) {
      messages.push(
        <div className="message">
          <small id="name">
            {this.props.sessionData.messages[i].user}</small>
            <small id="date"><i>@ {this.props.sessionData.messages[i].date}</i>
          </small>
          <br />
          <p id="body">{this.props.sessionData.messages[i].body}</p>
        </div>
      );
    }
    this.scrollToBottom();
    return messages;
  }
  inputChange(e) {
    this.setState({
      field: e.target.value
    });
  }
  scrollToBottom() {
    if(this.chatRef.current !== null && this.state.scrolled === false) { 
        this.chatRef.scrollTo(0, this.chatRef.scrollHeight);
    }
  }
  checkScroll() {
    if(this.chatRef.scrollHeight === this.chatRef.scrollTop + this.chatRef.clientHeight) {
        this.setState({ scrolled: false })
    } else {
        this.setState({ scrolled: true })
    }
  }
  render() {
    return (
      <div className="chat" id="flexbox">
        <div className="panel-top-bar">
            Chat
        </div>
        <div onScroll={() => this.checkScroll()} ref={x => (this.chatRef = x)} id="chat">
            {this.getMessages()}
        </div>
        <div id="input">
          <input
            onChange={x => this.inputChange(x)}
            value={this.state.field}
            type="text"
            height="100px"
            width="100%"
            ref={x => this.chatFieldRef = x}
          /><br />
          <button onClick={() => this.postMessage(this.state.field)}>
            Send
          </button>
        </div>
      </div>
    );
  }
}

export default Chat;
