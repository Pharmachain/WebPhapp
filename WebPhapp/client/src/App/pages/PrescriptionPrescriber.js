import React, { Component } from "react";
import axios from "axios";
import qs from 'qs';
import Prescription from "../components/Prescription";
import Error from "./Error";

class PrescriptionPrescriber extends Component {
  // Initialize the state
  state = {
    prescriptions: [],
    isFetching: true
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
    const prescriberID = querystring.ID;

    axios
      // String interpolation.
      .get(`/api/v1/prescribers/prescriptions/${prescriberID}`)
      .then(results => results.data)
      .then(prescriptions => this.setState({ prescriptions, isFetching: false }));
  };

  // displayPrescriptions() displays the properties of a prescription using Prescription
  // @return: returns all prescriptions for a prescriber id
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
      {user === 'Government' || user === 'Admin' ?
      <div>
      { isFetching ? ""
        :          
        /* Check to see if any prescriptions are found */
        prescriptions.length ?
        <div>
        <div className="bg-gradient-success py-7 py-xl-8 b-10"></div>
        <section className="section section-lg pt-lg-0 mt--200 m-5">
        <div>
          {/* Render the prescription */}
          {this.displayPrescriptions()}
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

export default PrescriptionPrescriber;
