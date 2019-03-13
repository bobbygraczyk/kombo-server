import React, { Component } from 'react';
import '../App.css';

class Card extends Component {
    render(){
        return(
            <div className="card">{this.props.text}</div>
        )
    }
}

export default Card;