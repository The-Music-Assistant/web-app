import React, { Component } from "react";
import Primary from "../pages/Primary/Primary";
import "normalize.css";
import "./App.scss";

class App extends Component {
    render() {
        return (
            <div className='App'>
                <Primary />
            </div>
        );
    }
}

export default App;
