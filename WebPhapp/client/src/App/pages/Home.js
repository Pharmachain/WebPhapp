import React, { Component } from "react";
import { Link } from "react-router-dom";

class Home extends Component {
  render() {
    return (
      <div className="App">
        {/* Link to PatientSearch.js */}
        <Link to={"./patientSearch"}>
          <div className="text-center">
            <button 
              type="button" 
              className="btn btn-primary my-4"
              variant="raised">
              Patient Search
            </button>
          </div>
        </Link>
        <Link to={"./prescriptionAdd"}>
          <div className="text-center">
            <button 
              type="button" 
              className="btn btn-primary my-4"
              variant="raised">
              Add Prescription
            </button>
          </div>
        </Link>
        <Link to={"./dispenserSearch"}>
          <div className="text-center">
            <button 
              type="button" 
              className="btn btn-primary my-4"
              variant="raised">
              Redeem Prescription
            </button>
          </div>
        </Link>
      </div>
    );
  }
}
export default Home;
