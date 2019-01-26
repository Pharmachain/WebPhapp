import React, { Component } from "react";
import axios from "axios";
import People from '../components/People'


class PatientSearch extends Component {
  // Initialize the state
  state = {
    people: [],
    firstName: "",
    lastName:""
  };

  onKeyDownFirstName = event => {
    this.setState({firstName: event.target.value});
  }

  onKeyDownLastName = event => {
    this.setState({lastName: event.target.value});
  }

  onSearchPatients = () => {
    const firstName = this.state.firstName;
    const lastName = this.state.lastName;
    var searchQuery= "/api/v1/patients?";
    if(!firstName && lastName)
      return;
    if(firstName !== '')
      searchQuery = searchQuery + `first=${firstName}`;
    if(lastName !== '')
      searchQuery = searchQuery + `last=${lastName}`;

    axios
      .get(searchQuery)
      .then(results => results.data)
      .then(people => this.setState({ people }));
  }

  // displayPrescription() displays the properties of a prescription using PrescriptionRow
  // @return: returns all prescriptions for a patient id

  render() {

    return (
      <div className="App">
        <h1>Patient Search </h1>
        <form>
          <label>
            First Name: &nbsp;
          </label>
          <input
            type="p"
            value={this.state.firstName}
            onChange={this.onKeyDownFirstName}
          />
          <label>
            &nbsp; Last Name: &nbsp;
          </label>
          <input
            type="p"
            value={this.state.lastName}
            onChange={this.onKeyDownLastName}
          />
        </form>
          <button onClick={this.onSearchPatients}>
            Search
          </button>
        <People patientList={this.state.people}/>
      </div>
    );
  }
}

export default PatientSearch;
