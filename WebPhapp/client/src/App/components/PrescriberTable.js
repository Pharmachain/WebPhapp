import React, { Component } from "react";
import PropTypes from "prop-types";

class PrescriberTable extends Component {
  // Displays all the prescriber in a table with with clickable links to each prescriber.
  displayPrescribers = () => {
    return this.props.prescriberList.map(prescriber => {
      return(
        <tr key={prescriber.prescriberID}>
          <td>
          <a href = {"/prescriber?ID=" + prescriber.prescriberID}>
              {prescriber.prescriberID}</a>
          </td>
          <td>
            <a href = {"/prescriber?ID=" + prescriber.prescriberID}>
              {prescriber.first}
            </a>
          </td>
          <td>
            <a href = {"/prescriber?ID=" + prescriber.prescriberID}>
              {prescriber.last}
            </a>
          </td>
          <td>
            <a href = {"/prescriber?ID=" + prescriber.prescriberID}>
              {prescriber.phone}
            </a>
          </td>
          <td>
            <a href = {"/prescriber?ID=" + prescriber.prescriberID}>
              {prescriber.location}
            </a>
          </td>
        </tr>
      );
    });
  }

  render() {
    return (
      // Returns a table of prescribers styled according to the Argon style system
      <div className="card shadow">
        <div className="card-header border-0">
          <h3 className="mb-0">Prescribers</h3>
        </div>
        <div className="table-responsive table-hover">
          <table className="table align-items-center table-flush">
            <thead className="thead-light">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Phone</th>
                <th scope="col">Location</th>
              </tr>
            </thead>
            <tbody>
              {this.displayPrescribers()}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

// The properties of each prescriber id, first name, last name, and date of birth
PrescriberTable.propTypes = {
  prescriberList: PropTypes.arrayOf(
      PropTypes.shape({
        prescriberID: PropTypes.number.isRequired,
        first: PropTypes.string,
        last: PropTypes.string,
        phone: PropTypes.number,
        location: PropTypes.string
      }).isRequired,
    )
}

export default PrescriberTable;

