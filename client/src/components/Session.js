import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

class CreateSession extends Component {
    render(){
        return(
            <React.Fragment>
            <Link to="/create"><div className="create-session"><h4>Start new session</h4></div></Link>
            </React.Fragment>
            
        )
    }
}

class NewSession extends Component {
    constructor(props) {
        super(props);
        this.state = {
            field: "Session Name",
            errorString: ""
        }
    }
    createNewSession(id) {      
        if(id && id.length > 3 && id !== "Session Name") {
            const key = {
                "key": id,
                "streamLayout": {
                    "name": {
                        "color": "black",
                        "fontSize": "24px",
                        "top": "50px",
                        "width": "800px"
                    },
                    "score": {
                        "color": "black",
                        "fontSize": "24px",
                        "top": "50px",
                        "width": "1000px"
                    },
                    "round": {
                        "color": "black",
                        "fontSize": "24px",
                        "top": "50px",
                    },
                    "event": {
                        "color": "black",
                        "fontSize": "24px",
                        "top": "100px",
                    },
                }
            };
            axios.post("http://localhost:3000/api/sessions", key)
                .then(res => {
                    if (res.data){
                        this.props.setSession(key);
                    }
                })
                .catch(err => {
                    console.log(err)
                    this.setState({errorString: "Session " + this.state.field + " already exists!", field: "Session Name"})
                })

        } else {
            console.log("Does not meet input requirements");
            this.setState({errorString: "Does not meet input requirements"})
        }
    }
    inputChange(e) {
        this.setState({
            field: e.target.value
          })
    }
    render(){
        return(
            <div className="welcome">
            <span>
              <h1>kombo</h1>
            </span>
            <input onChange={(x) => this.inputChange(x)} value={this.state.field} type="text" />
            <button onClick={() => this.createNewSession(this.state.field)}>Create</button><br /><br />
            {this.state.errorString}
          </div>
        )
    }
}

export {CreateSession, NewSession};