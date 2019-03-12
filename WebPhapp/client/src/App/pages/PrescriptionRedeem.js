import React, { Component } from "react";
import axios from "axios";
import Prescription from "../components/Prescription";
import qs from 'qs';

class PrescriptionRedeem extends Component {
  // Initialize the state
  state = {
    // prescriptions are all the prescriptions given a dispenser id
    prescriptions: [],
    dispenserID: 0
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
    const dispenserID = querystring.ID;
    this.setState({dispenserID: dispenserID});

    axios
      // String interpolation.
      .get(`api/v1/dispensers/prescriptions/all/${dispenserID}`)
      .then(results => results.data)
      .then(prescriptions => this.setState({ prescriptions }));
  };

  // displayPrescriptions() displays the properties of a prescription using Prescription
  // @return: returns all prescriptions for a patient id
  displayPrescriptions = () => {
    const prescriptions = this.state.prescriptions;
    // open are all the prescriptions that are open given a dispenser id
    var open = prescriptions.filter(prescription => prescription.refillsLeft > 0 && prescription.cancelDate < 1 );
    // historical are all the prescriptions that are historical given a dispenser id
    var historical = prescriptions.filter(prescription => prescription.cancelDate > 0 || prescription.refillsLeft < 1);

    return(
      <div className="col-xl-12 order-xl-1 center">
        <div className="card bg-secondary shadow">
        
          <div className="card-header bg-white border-0">
              <div className="row align-items-center">
                <div className="col-8 text-left">
                  <h3 className="mb-0">Dispenser: {this.state.dispenserID} Prescriptions</h3>
                </div>
              </div>
          </div>

          <div className="card-body">
            <div className="nav-wrapper">
                <ul className="nav nav-tabs nav-justified flex-column flex-md-row justify-content-center" id="prescription" role="tablist">
                    <li className="nav-item">
                        <a className="nav-link mb-sm-3 mb-md-0 active" id="prescription-tab-all" data-toggle="tab" href="#prescription-all" role="tab" aria-controls="prescription-tab-all" aria-selected="true"><i className="fas fa-globe-americas"></i> All</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link mb-sm-3 mb-md-0" id="prescription-tab-open" data-toggle="tab" href="#prescription-open" role="tab" aria-controls="prescription-tab-open" aria-selected="false"><i className="fas fa-clipboard-check"></i> Open</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link mb-sm-3 mb-md-0" id="prescription-tab-historical" data-toggle="tab" href="#prescription-historical" role="tab" aria-controls="prescription-tab-historical" aria-selected="false"><i className="fas fa-history"></i> Historical</a>
                    </li>
                </ul>
            </div>

            <div className="card-body">
              <div className="tab-content">
                  <div className="tab-pane fade show active" id="prescription-all" role="tabpanel" aria-labelledby="prescription-tab-all">
                    <Prescription
                      prescriptions = {this.state.prescriptions}
                    />
                  </div>
                  <div className="tab-pane fade" id="prescription-open" role="tabpanel" aria-labelledby="prescription-tab-open">
                    <Prescription
                      prescriptions = {open}
                    />         
                  </div>
                  <div className="tab-pane fade" id="prescription-historical" role="tabpanel" aria-labelledby="prescription-tab-historical">
                    <Prescription
                      prescriptions = {historical}
                    />
                  </div>
              </div>
            </div>
            
          </div>

        </div>
      </div>
    )
  }

  render() {
    var prescriptions = this.state.prescriptions;
      return (
        <div className="App">
          {/* Check to see if any prescriptions are found*/}
          {prescriptions ? (
            <div>
              {/* Render the prescription */}
              {this.displayPrescriptions()}
            </div>
          ) : (
            <div>
              <h2>No Prescriptions Found</h2>
            </div>
          )}
        </div>
      );
  }
};

export default PrescriptionRedeem;
