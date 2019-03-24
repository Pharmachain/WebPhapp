import React, { Component } from "react";
import axios from "axios";
import Prescription from "../components/Prescription";
import qs from 'qs';

class Patient extends Component {
  // Initialize the state
  state = {
    patientID: 0,
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
      />
    )
  }

  render() {
    const prescriptions = this.state.prescriptions;
    const {isFetching} = this.state;
    
    return (
      /* Logic to render prescriptions or warning conditionally */
      <div className="App">
      { isFetching ? ""
        :          
        /* Check to see if any prescriptions are found */
        prescriptions.length ?
        <div>
          <div className="header bg-gradient-primary py-7 py-lg-8">
          {/* Render the prescription */}
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
        </div>
        </div>
        : 
        <div className="col-8 center">
          <div className="alert alert-warning" role="alert">
          <span className="alert-inner--text"><strong>WARNING: </strong> No prescriptions found.</span>
          </div>
        </div>
      }
      </div>
    );
  }
}

export default Patient;
