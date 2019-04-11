import React, { Component } from "react";
import axios from "axios";
import PatientTable from '../components/PatientTable'
import Error from './Error';

class PatientSearch extends Component {
  // Initialize the state
  state = {
    patients: [],
    patientID: "",
    firstName: "",
    lastName: ""
  };

  componentDidMount() {
    // Loads all patients by default
    if(this.props.role === 'Patient'){
        return;
    }

    axios
      .get(`/api/v1/patients?first=&last=`)
      .then(results => results.data)
      .then(patients => this.setState({ patients }));
  }

  // Updating text in the patient id state
  onKeyDownPatientID = event => {
    this.setState({patientID: String(event.target.value)});
  }

  // Updating text in the first name state
  onKeyDownFirstName = event => {
    this.setState({firstName: event.target.value});
  }

  // Updating text in the last name state
  onKeyDownLastName = event => {
    this.setState({lastName: event.target.value});
  }

  // Search query for patient lookup via names
  onSearchPatients = e => {
    e.preventDefault()
    const patientID = this.state.patientID;
    const firstName = this.state.firstName;
    const lastName = this.state.lastName;

    // String interpolation
    var idSearchQuery = `/api/v1/patients/${patientID}`;
    var nameSearchQuery = `/api/v1/patients?first=${firstName}&last=${lastName}`;
    var defaultQuery = `/api/v1/patients?first=&last=`;

    if (patientID) {
      axios
      .get(idSearchQuery)
      .then(results => results.data)
      .then(patients => this.setState({ patients: [patients] }));
    }

    else if (firstName) {
      axios
      .get(nameSearchQuery)
      .then(results => results.data)
      .then(patients => this.setState({ patients }));
    }

    else if (lastName) {
      axios
      .get(nameSearchQuery)
      .then(results => results.data)
      .then(patients => this.setState({ patients }));
    }

    else {
      axios
      .get(defaultQuery)
      .then(results => results.data)
      .then(patients => this.setState({ patients }));
    }
  }

  render() {
    // User role from log in
    const user = this.props.role; 
    return (
      <div>
      {user === 'Prescriber' || user === 'Dispenser' || user === 'Government' || user === 'Admin' ?
      <div>
      <div className="bg-gradient-primary py-7 py-xl-8 b-10"></div>
        <section className="section section-lg pt-lg-0 mt--200 m-5">  
        <div className="col-xl-9 order-xl-1 center">
          <div className="card bg-secondary shadow">
            <div className="card-header bg-white border-0">
              <div className="row align-items-center">
                <div className="col-8 text-left">
                  <h3 className="mb-0">Patient Search</h3>
                </div>
              </div>
            </div>
            <div className="card-body text-left">
            <div className="form-group">
            <form onSubmit={this.onSearchPatients}>
              <div className="form-group mb-3">
                <div className="input-group input-group-alternative">
                  <div className="input-group-prepend">
                    <span className="input-group-text"></span>
                  </div>
                  <input
                    className="form-control"
                    id="patient_id"
                    placeholder="Patient ID"
                    type="text"
                    value={this.state.patientID}
                    onChange={this.onKeyDownPatientID}
                  />
                </div>
              </div>
              <hr className="my-4"></hr>
              <div className="form-group">
                <div className="input-group input-group-alternative">
                  <div className="input-group-prepend">
                    <span className="input-group-text"></span>
                  </div>
                  <input
                    className="form-control"
                    id="first_name"
                    placeholder="First Name"
                    type="p"
                    value={this.state.firstName}
                    onChange={this.onKeyDownFirstName}
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="input-group input-group-alternative">
                  <div className="input-group-prepend">
                    <span className="input-group-text"></span>
                  </div>
                  <input
                    className="form-control"
                    id="last_name"
                    placeholder="Last Name"
                    type="p"
                    value={this.state.lastName}
                    onChange={this.onKeyDownLastName}
                  />
                </div>
              </div>
              <div className="text-center">
                <button type="submit" id="patient_search_button" className="btn btn-icon btn-3 btn-primary">
                  <span className="btn-inner--icon"><i className="fas fa-search"></i></span>
                  <span className="btn-inner--text">Search</span>
                </button>
              </div>
            </form>
            <br/>
            <PatientTable patientList={this.state.patients}/>
            </div>
            </div>
          </div>
        </div>
        </section>
        </div>
      : 
      <Error/> }
      </div>
    );
  }
}

export default PatientSearch;
