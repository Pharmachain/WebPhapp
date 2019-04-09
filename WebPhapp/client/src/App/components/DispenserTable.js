import React, { Component } from "react";
import PropTypes from "prop-types";

class DispenserTable extends Component {
  // Displays all the dispensers in a table with with clickable links to each dispenser.
  displayDispensers = () => {
    return this.props.dispenserList.map(dispenser => {
      return(
        <tr key={dispenser.dispenserID}>
          <td>
          <a href = {"/dispenser?ID=" + dispenser.dispenserID}>
              {dispenser.dispenserID}</a>
          </td>
          <td>
            <a href = {"/dispenser?ID=" + dispenser.dispenserID}>
              {dispenser.name}
            </a>
          </td>
          <td>
            <a href = {"/dispenser?ID=" + dispenser.dispenserID}>
              {dispenser.phone}
            </a>
          </td>
          <td>
            <a href = {"/dispenser?ID=" + dispenser.dispenserID}>
              {dispenser.location}
            </a>
          </td>
        </tr>
      );
    });
  }

  render() {
    return (
      // Returns a table of dispensers styled according to the Argon style system
      <div className="card shadow">
        <div className="card-header border-0">
          <h3 className="mb-0">Dispensers</h3>
        </div>
        <div className="table-responsive table-hover">
          <table className="table align-items-center table-flush">
            <thead className="thead-light">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Phone</th>
                <th scope="col">Location</th>
              </tr>
            </thead>
            <tbody>
              {this.displayDispensers()}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

// The properties of each dispenser id, name, last name, and date of birth
DispenserTable.propTypes = {
  dispenserList: PropTypes.arrayOf(
      PropTypes.shape({
        dispenserID: PropTypes.number.isRequired,
        name: PropTypes.string,
        phone: PropTypes.string,
        location: PropTypes.string
      }).isRequired,
    )
}

export default DispenserTable;

