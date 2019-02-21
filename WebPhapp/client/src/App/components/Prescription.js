import React, { Component } from "react";
import PropTypes from "prop-types";
  
class Prescription extends Component {
    // Displays all prescriptions for a patient
    displayPrescriptions = () => {
        return this.props.prescriptions.map(prescription => {
            var fillDates = Array.isArray(prescription.fillDates) && prescription.fillDates.length === 0 ? "Not Yet Filled" : prescription.fillDates.toString();
            var cancel = prescription.cancelled ? "Yes" : "No";
            var cancelDate = prescription.cancelDate === "" ? "TBD" : prescription.cancelDate; 

            // var writtenDate = prescription.writtenDate.split(" ", 4).join(" ")
            var writtenDate = prescription.writtenDate;
            return(
                <div className="card card-stats mb-4 ml-4" key={prescription.prescriptionID} style={{width: '21rem' }} >
                    <div className="card-body">
                        <div className="row">
                            <div className="col">
                                <h5 className="card-title text-uppercase text-muted text-left mb-0">Prescription {prescription.prescriptionID} &nbsp;
                                    <span className="h2 font-weight-bold mb-0">{prescription.drugName}</span>
                                </h5>
                                <p className="mt-3 mb-0 text-muted text-sm text-left">
                                    <span className="text-nowrap">
                                        Quantity: {prescription.quantity}
                                        <br></br>
                                        Days For: {prescription.daysFor}
                                        <br></br>
                                        Refills Left: {prescription.refillsLeft}
                                        <br></br>
                                        Date Written: {writtenDate}
                                    </span> 
                                </p>
                            </div>
                            <div className="col">
                                <div className="icon icon-shape bg-default text-white rounded-circle shadow lg">
                                    <i className="fas fa-file-prescription"></i>
                                </div>
                            </div>
                        </div>
                        <br></br>
                        <button className="btn btn-icon btn-3 btn-outline-primary btn-block" type="button" data-toggle="modal" data-target="#prescription-modal">
                            <span className="btn-inner--icon"><i className="ni ni-bullet-list-67"></i></span>
                            <span className="btn-inner--text">More Info</span>
                        </button>


                        <div className="col-md-4">
                        <div className="modal fade" id="prescription-modal">
                        <div className="modal-dialog modal-lg modal-dialog-centered modal">
                            <div className="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title" id="modal-title-default">Prescription: {prescription.drugName}</h4>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div className="card-body">
                            <hr></hr>
                            <div class="row justify-content-center text-sm font-weight-light">
                                <div class="col-auto"><i className="fas fa-file-prescription"></i> Prescription ID: {prescription.prescriptionID}</div>
                                <div class="col-auto"><i className="fas fa-capsules"></i> Drug ID: {prescription.drugID}</div>
                                <div class="col-auto"><i class="fas fa-user"></i> Patient ID: {prescription.patientID}</div>
                                <div class="col-auto"><i class="fas fa-user-md"></i> Prescriber ID: {prescription.prescriberID}</div>
                                <div class="col-auto"><i class="fas fa-hospital"></i> Dispenser ID: {prescription.dispenserID}</div>
                            </div>
                            </div>
                            </div>
                        </div>
                        </div>
                        </div>
                    
                    </div>
                </div>
            )
        })
    }

    render() {
        return(
            // <table className="table table-hover">
            // <tbody>
            //   <tr className="table-primary">
            //     <th scope="col">Prescription ID</th>
            //     <th scope="col">Patient ID</th>
            //     <th scope="col">Drug ID</th>
            //     <th scope="col">Prescriber ID</th>
            //     <th scope="col">Dispenser ID</th>
            
            //     <th scope="col">Quantity</th>
            //     <th scope="col">Days For</th>
            //     <th scope="col">Refills Left</th>

            //     <th scope="col">Filled Dates</th>
            //     <th scope="col"> Written Date</th>

            //     <th scope="col">Cancelled</th>
            //     <th scope="col">Cancel Date</th>
            //   </tr>
            <div className="container">
                <div className="masonry align-items-left">
                        {this.displayPrescriptions()}
                </div>
            </div>
        );
    }
}

Prescription.propTypes = {
    prescriptions: PropTypes.arrayOf(
        PropTypes.shape({
            prescriptionID: PropTypes.number.isRequired,
            patientID: PropTypes.number.isRequired,
            drugID: PropTypes.number.isRequired,
            fillDates: PropTypes.arrayOf(PropTypes.string).isRequired,
            writtenDate: PropTypes.string.isRequired,
            quantity: PropTypes.number.isRequired,
            daysFor: PropTypes.number.isRequired,
            refillsLeft: PropTypes.number.isRequired,
            prescriberID: PropTypes.number.isRequired,
            dispenserID: PropTypes.number.isRequired,
            cancelled: PropTypes.bool.isRequired,
            cancelDate: PropTypes.string.isRequired,
        }).isRequired,
    ),
  };

export default Prescription;