import React, { Component } from 'react';
import '../App.css';

class Twitch extends Component {
    render(){
        let chatUrl;
        let streamUrl;
        if (this.props.isLive && this.props.sessionData.streamInfo.streamQueue) {
            chatUrl = `https://www.twitch.tv/embed/${this.props.sessionData.streamInfo.streamQueue[this.props.streamIndex].stream.streamName}/chat`;
            streamUrl = `https://player.twitch.tv/?channel=${this.props.sessionData.streamInfo.streamQueue[this.props.streamIndex].stream.streamName}&muted=true`;
            return(
                <div className="twitch" id="flexbox">
                    <div className="panel-top-bar">Twitch</div>
                    <div id="stream">
                    <iframe
                        id="video"
                        src={streamUrl}
                        height="100%"
                        width="100%"
                        frameBorder="0"
                        scrolling="no"
                        title="Stream"
                        allowFullScreen={true}>
                    </iframe>
                    </div>
                    <div id="chat">
                    <iframe frameBorder="0"
                        scrolling="yes"
                        id="chat_embed"
                        src={chatUrl}
                        height="100%"
                        title="Stream Chat"
                        width="100%">
                    </iframe>
                    </div>
                </div>
            )
        } else {
            return(
                <div className="twitch" id="flexbox">
                    {this.props.isLive ? "No stream information" : "Go live to see twitch"}
                </div>
            )
        }
    }
}

export default Twitch;