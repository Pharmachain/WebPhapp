import React, { Component } from "react";
import PropTypes from "prop-types";

class PatientTable extends Component {
  // Displays all the patients in a table with clickable links to each patient.
  displayPatients = () => {
    return this.props.patientList.map(person => {
      return(
        <tr key={person.patientID} onClick={() => window.location.href="/patient?ID=" + person.patientID} style={{ cursor: 'pointer' }}>
          <td>
          <a href = {"/patient?ID=" + person.patientID}>
              {person.patientID}</a>
          </td>
          <td>
            <a href = {"/patient?ID=" + person.patientID}>
              {person.first}
            </a>
          </td>
          <td>
            <a href = {"/patient?ID=" + person.patientID}>
              {person.last}
            </a>
          </td>
          <td>
            <a href = {"/patient?ID=" + person.patientID}>
              {person.dob}
            </a>
          </td>
        </tr>
      );
    });
  }

  render() {
    return (
      // Returns a table of patients styled according to the Argon style system
      <div className="card shadow">
        <div className="card-header border-0">
          <h3 className="mb-0">Patients</h3>
        </div>
        <div className="table-responsive table-hover">
          <table className="table align-items-center table-flush">
            <thead className="thead-light">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Date Of Birth</th>
              </tr>
            </thead>
            <tbody>
              {this.displayPatients()}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

// The properties of each person patient id, first name, last name, and data of birth
PatientTable.propTypes = {
  patientList: PropTypes.arrayOf(
      PropTypes.shape({
        patientID: PropTypes.number.isRequired,
        first: PropTypes.string,
        last: PropTypes.string,
        dob: PropTypes.string
      }).isRequired,
    )
}

export default PatientTable;

