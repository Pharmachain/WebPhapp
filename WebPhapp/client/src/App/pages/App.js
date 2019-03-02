import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.css";
import Home from "./Home";

import Patient from "./Patient";
import DispenserPatient from "./DispenserPatient";
import PatientSearch from "./PatientSearch"
import DispenserPatientSearch from "./DispenserPatientSearch"
import PrescriptionAdd from "./PrescriptionAdd.js"
import PrescriptionEdit from "./PrescriptionEdit.js"
import Header from "../components/Header.js"

import CancelAlert from "./CancelAlert.js"

class App extends Component {
  render() {
    const App = () => (
      <div>
        <Header/>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/patient" component={Patient} />
          <Route path="/dispenserPatient" component={DispenserPatient} />
          <Route path="/patientSearch" component={PatientSearch} />
          <Route path="/dispenserPatientSearch" component={DispenserPatientSearch} />
          <Route path="/prescriptionAdd" component={PrescriptionAdd}/>
          <Route path="/prescriptionEdit" component={PrescriptionEdit}/>
          <Route path="/cancel" component={CancelAlert}/>
        </Switch>
      </div>
    );
    return (
      <BrowserRouter>
          <Switch>
            <App />
          </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
