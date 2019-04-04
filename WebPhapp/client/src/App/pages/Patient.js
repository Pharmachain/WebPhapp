import React, { Component } from "react";
import axios from "axios";
import qs from 'qs';
import Prescription from "../components/Prescription";
import Error from "./Error";

class Patient extends Component {
  // Initialize the state
  state = {
    patientID: 0,
    prescriptions: [],
    isFetching: true,
    validPatient: true //TODO
  };

  // Fetch the prescription on first mount
  componentDidMount() {
    this.getPrescriptions();
  }

  // Retrieves the items in a prescription from the Express app
  // ex. api/v1/prescriptions/01
  getPrescriptions = () => {

    // Gets parameter from the URL of 'ID'
    const querystring = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
    const patientID = querystring.ID;
    this.setState({patientID});

    axios
      // String interpolation.
      .get(`/api/v1/prescriptions/${patientID}`)
      .then(results => results.data)
      .then(prescriptions => this.setState({ prescriptions, isFetching: false }));
  };

  // displayPrescriptions() displays the properties of a prescription using Prescription
  // @return: returns all prescriptions for a patient id
  displayPrescriptions = () => {
    return(
      <Prescription
        prescriptions = {this.state.prescriptions}
        getPrescriptions = {this.getPrescriptions}
        role = {this.props.role}
      />
    )
  }

  render() {
    // User role from log in
    const user = this.props.role; 
    const prescriptions = this.state.prescriptions;
    const {isFetching} = this.state;
    
    return (
      /* Logic to render prescriptions or warning conditionally */
      <div>
      {user === 'Patient' || user === 'Prescriber' || user === 'Dispenser' || user === 'Government' || user === 'Admin' ?
      <div>
      { isFetching ? ""
        :          
        /* Check to see if any prescriptions are found */
        prescriptions.length ?
        <div>
          {/* Render the prescription */}
          <div className="bg-gradient-primary py-7 py-xl-8 b-10"></div>
          <section className="section section-lg pt-lg-0 mt--200 m-5">
          <div className="col-xl-12 order-xl-1 center">
            <div className="card bg-secondary shadow">
              <div className="card-header bg-white border-0">
                  <div className="row align-items-center">
                    <div className="col-8 text-left">
                      <h3 className="mb-0">Patient: {this.state.patientID} Prescriptions</h3>
                    </div>
                  </div>
              </div>
              <div className="card-body"> {this.displayPrescriptions()} </div>
            </div>
          </div>
          </section>
      </div>
        : 
        <div className="col-8 center">
          <div className="alert alert-warning" role="alert">
          <span className="alert-inner--text"><strong>WARNING: </strong> No prescriptions found.</span>
          </div>
        </div> }
      </div>
      :
      <Error/> }
      </div>
    );
  }
}

export default Patient;
