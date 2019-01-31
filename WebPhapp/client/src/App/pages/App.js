import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import Home from "./Home";

import List from "./List";
import Patient from "./Patient";
import PatientSearch from "./PatientSearch"
import PrescriptionAdd from "./PrescriptionAdd.js"

class App extends Component {
  render() {
    const App = () => (
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/list" component={List} />
          <Route path="/patient" component={Patient} />
          <Route path="/patientSearch" component={PatientSearch} />
          <Route path="/addPrescription" component={PrescriptionAdd}/>
        </Switch>
      </div>
    );
    return (
      <Switch>
        <App />
      </Switch>
    );
  }
}

export default App;
