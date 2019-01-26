import React, { Component } from "react";
import PropTypes from "prop-types";

class People extends Component {


  displayPeople = () => {
    return this.props.patientList.map(person => {
      return(
        <tr key={person.patient_id}>
          <td>
          {person.patient_id}
          </td>
          <td>
          {person.first}
          </td>
          <td>
          {person.last}
          </td>
          <td>
          {person.dob}
          </td>
        </tr>
      );
    });
  }

  render() {
    return (
      <table>
      <tbody>
        <tr>
          <th>ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Date Of Birth</th>
        </tr>

        {this.displayPeople()}
      </tbody>
      </table>
    );
  }
}

People.propTypes = {
  patientList: PropTypes.arrayOf(
      PropTypes.shape({
        patient_id: PropTypes.number.isRequired,
        first: PropTypes.string,
        last: PropTypes.string,
        dob: PropTypes.string
      }).isRequired,
    )
}

export default People;
