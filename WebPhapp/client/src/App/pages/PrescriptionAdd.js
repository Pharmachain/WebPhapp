import React, { Component } from "react";
import axios from "axios";


class PrescriptionAdd extends Component {
  // Initialize the state
  state = {
    patientID: 0,
    drugID:0,
    quantity: "",
    daysValid: 0,
    refills: 0,
    prescriberID: 0,
    dispensorID: 0,
    message: ''
  };

  // Updating value in the patientID state
  onKeyDownPatientID = event => {
    this.setState({patientID: event.target.value});
  }

  /* Seperate component for this to validate it... */
  // Updating value in the drugID state
  onKeyDownDrugID = event => {
    this.setState({drugID: event.target.value});
  }

  // Updating value in the quantity state
  onKeyDownQuantity = event => {
    this.setState({quantity: event.target.value});
  }

  // Updating value in the days daysValid state
  onKeyDownDaysValid = event => {
    this.setState({daysValid: event.target.value});
  }

  // Updating value in the refills state
  onKeyDownRefills = event => {
    this.setState({refills: event.target.value});
  }

  // Updating value in the dispensorID state
  onKeyDownDispensorID = event => {
    this.setState({dispensorID: event.target.value});
  }

  // Sending the prescription to be added
  onSendPrecription = () => {

    var prescriptionAddQuery= `/api/v1/prescriptions/add`;

    /* Send a message back for an error or a success */
    axios
      .post(prescriptionAddQuery,{
        "patientID": this.state.patientID,
        "drugID": this.state.drugID,
        "quantity": this.state.quantity,
        "daysValid": this.state.daysValid,
        "refills": this.state.refills,
        "prescriberID": this.state.prescriberID,
        "dispensorID": this.state.dispensorID
      });

  }

  render() {

    return (
      <div className="form-group">
          <nav className="navbar navbar-horizontal navbar-expand-lg navbar-dark bg-primary">
            <div className="container">
                <a className="navbar-brand" href="#">Add Prescription</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-default" aria-controls="navbar-default" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbar-default">
                    <div className="navbar-collapse-header">
                      <div className="row">
                          <div className="col-6 collapse-brand">
                              <a href="../../index.html">
                                  {/* <img src="../../../public/assets/img/brand/blue.png"/> */}
                              </a>
                          </div>
                          <div className="col-6 collapse-close">
                              <button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#navbar-default" aria-controls="navbar-default" aria-expanded="false" aria-label="Toggle navigation">
                                  <span></span>
                                  <span></span>
                              </button>
                          </div>
                      </div>
                    </div>
                    <ul className="navbar-nav ml-lg-auto">
                        <li className="nav-item">
                            <a className="nav-link nav-link-icon" href="#">
                                <i className="ni ni-favourite-28"></i>
                                <span className="nav-link-inner--text d-lg-none">Discover</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link nav-link-icon" href="#">
                                <i className="ni ni-notification-70"></i>
                                <span className="nav-link-inner--text d-lg-none">Profile</span>
                            </a>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link nav-link-icon" href="#" id="navbar-default_dropdown_1" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="ni ni-settings-gear-65"></i>
                                <span className="nav-link-inner--text d-lg-none">Settings</span>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbar-default_dropdown_1">
                                <a className="dropdown-item" href="#">Action</a>
                                <a className="dropdown-item" href="#">Another action</a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="#">Something else here</a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <br/>

        <form>
          <div className="row">
            <div className="col-md-6 center">
              <div className="form-group">
                <input 
                type="p" 
                className="form-control" 
                placeholder="Patient ID"
                // value={this.state.patientID}
                onChange={this.onKeyDownPatientID}/> 
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 center">
              <div className="form-group">
                <input 
                type="p" 
                className="form-control" 
                placeholder="Drug"
                // value={this.state.drugtID}
                onChange={this.onKeyDownDrugID}/> 
              </div>
            </div>
          </div> 
          <div className="row">
            <div className="col-md-6 center">
              <div className="form-group">
                <input 
                type="p" 
                className="form-control" 
                placeholder="Quantity"
                // value={this.state.quantity}
                onChange={this.onKeyDownQuantity}/> 
              </div>
            </div>
          </div> 
          <div className="row">
            <div className="col-md-6 center">
              <div className="form-group">
                <input 
                type="p" 
                className="form-control" 
                placeholder="Days Valid"
                // value={this.state.daysValid}
                onChange={this.onKeyDownDaysValid}/> 
              </div>
            </div>
          </div> 
          <div className="row">
            <div className="col-md-6 center">
              <div className="form-group">
                <input 
                type="p" 
                className="form-control" 
                placeholder="Quantity"
                // value={this.state.quantity}
                onChange={this.onKeyDownQuantity}/> 
              </div>
            </div>
          </div> 
          <div className="row">
            <div className="col-md-6 center">
              <div className="form-group">
                <input 
                type="p" 
                className="form-control" 
                placeholder="Dispenser ID"
                // value={this.state.dispensorID}
                onChange={this.onKeyDownDispensorID}/> 
              </div>
            </div>
          </div> 
        </form>
        
        <button 
          type="button" 
          class="btn btn-primary my-4 offset-5" 
          onClick={this.onSendPrecription}>
          Add Prescription
        </button>

      </div>
    );
  }
}

export default PrescriptionAdd;
