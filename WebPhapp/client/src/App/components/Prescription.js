import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";  

//todo: map fillDates array to table
class Prescription extends Component {
    constructor(props){
        super(props);

        // Check for type of user with some API call.
        const user = 'prescriber';
        this.state={
            user: user,
            clicked: 0
        }
    }

    // Gets the events id, to cancel the proper prescription.
    onCancelClick = event => {
        // Probably add some validation to make sure the user wants to delete this.
        const cancelQuery = `/api/v1/prescriptions/cancel/${event.target.id}`
        axios
        .get(cancelQuery)
        .then(results => results.data);

        //Grey out cancelled prescription.
        this.props.getPrescriptions();
    }

    // Displays all prescription cards for a patient
    displayPrescriptions = () => {
        var prescriptionCount = -1;
        return this.props.prescriptions.map(prescription => {
            prescriptionCount += 1;
            // var writtenDate = prescription.writtenDate.split(" ", 4).join(" ")
            var writtenDate = "Sat Feb 23 2019";
            console.log(prescription.fillDates)

            return(
                <div className="card card-stats mb-4 ml-4"  key={prescription.prescriptionID} style={{width: '21rem'}} >
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
                        <button className="btn btn-icon btn-3 btn-outline-primary btn-block" type="button" data-toggle="modal" data-target="#prescription-modal" id={prescriptionCount} onClick={this.onClickViewPrescription}>
                            <span className="btn-inner--icon"><i className="ni ni-bullet-list-67"></i></span>
                            <span className="btn-inner--text">More Info</span>
                        </button> 
                    </div>
                </div>
            )
        })
    }

    // 
    onClickViewPrescription = (event) => {
        var prescriptionID = event.target.id;
        const modalPrescription = this.props.prescriptions[prescriptionID];
        this.state.modalPrescription = modalPrescription;
        this.forceUpdate();
    }

    render() {
        var prescription = this.state.modalPrescription;
        // var fillDates = Array.isArray(prescription.fillDates) && prescription.fillDates.length === 0 ? "Not Yet Filled" : prescription.fillDates;
        // var cancelDate = prescription.cancelDate === -1 ? "T.B.D." : prescription.cancelDate; 
        var cancelDate = "TBD";
        // var writtenDate = prescription.writtenDate.split(" ", 4).join(" ")

        var writtenDate = "Sat Feb 23 2019";
        var fillDates = ["Sat Feb 23 2019", "Sun Jan 7 2019", "Wed Apr 31 2019"];
        return(
            <div className="container">
                <div className="masonry align-items-left">
                      {this.displayPrescriptions()}
                      {this.state.modalPrescription && <div className="col-md-4">
                        <div className="modal fade" tabIndex="-1" id="prescription-modal">
                        <div className="modal-dialog modal-lg modal-dialog-centered modal" role="document">
                            <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title" id="modal-title-default">Prescription: {prescription.drugName}</h3>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true"><i className="ni ni-fat-remove"></i></span>
                                </button>
                            </div>
                            
                            <div className="modal-body">
                            <div className="row">
                                <div className="col-auto">
                                    <div className="card card-stats mb-4 mb-lg-0 shadow" style={{ width: '18rem' }}>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col">
                                                    <h5 className="card-title text-uppercase text-muted mb-0 text-left">Quantity:</h5>
                                                    <span className="h3 font-weight-bold mb-0">{prescription.quantity}</span>
                                                </div>
                                                <div className="col-auto">
                                                <div className="icon icon-shape bg-primary text-white rounded-circle shadow">
                                                    <i className="fas fa-pills"></i>
                                                </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <br></br>
                                    <div className="card card-stats mb-4 mb-lg-0 shadow" style={{ width: '18rem' }}>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col">
                                                    <h5 className="card-title text-uppercase text-muted mb-0 text-left">Number of Days For:</h5>
                                                    <span className="h3 font-weight-bold mb-0">{prescription.daysFor}</span>
                                                </div>
                                                <div className="col-auto">
                                                <div className="icon icon-shape bg-success text-white rounded-circle shadow">
                                                    <i className="ni ni-calendar-grid-58"></i>
                                                </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <br></br>
                                    <div className="card card-stats mb-4 mb-lg-0 shadow" style={{ width: '18rem' }}>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col">
                                                    <h5 className="card-title text-uppercase text-muted mb-0 text-left">Refills Left:</h5>
                                                    <span className="h3 font-weight-bold mb-0">{prescription.refillsLeft}</span>
                                                </div>
                                                <div className="col-auto">
                                                <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                                                    <i className="fas fa-prescription-bottle"></i>
                                                </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <br></br>
                                    <div className="card card-stats mb-4 mb-lg-0 shadow" style={{ width: '18rem' }}>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col">
                                                    <h5 className="card-title text-uppercase text-muted mb-0 text-left">Written Date:</h5>
                                                    <span className="h3 font-weight-bold mb-0">{writtenDate}</span>
                                                </div>
                                                <div className="col-auto">
                                                <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                                                    <i className="fas fa-user-edit"></i>
                                                </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <br></br>
                                    <div className="card card-stats mb-4 mb-lg-0 shadow" style={{ width: '18rem' }}>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col">
                                                    <h5 className="card-title text-uppercase text-muted mb-0 text-left">Date Cancelled:</h5>
                                                    <span className="h3 font-weight-bold mb-0">{cancelDate}</span>
                                                </div>
                                                <div className="col-auto">
                                                    <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                                                        <i className="fas fa-ban"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col">
                                    <div className="card shadow">
                                        <div className="card-header border-0">
                                        <h4 className="mb-0 text-left">Past Refill Dates</h4>
                                        </div>
                                        <div className="table-responsive">
                                        <table className="table align-items-center table-flush">
                                            <thead className="thead-light">
                                            <tr>
                                                <th scope="col">Refill Number</th>
                                                <th scope="col">Date</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>1</td>
                                                    <td>{fillDates[0]}</td> 
                                                </tr>
                                                <tr>
                                                    <td>2</td>
                                                    <td>{fillDates[1]}</td> 
                                                </tr>
                                                <tr>
                                                    <td>3</td>
                                                    <td>{fillDates[2]}</td> 
                                                </tr>
                                            </tbody>
                                        </table>
                                        </div>
                                    </div>
                                    <br></br>

                                    <div className="row justify-content-center form-inline">
                                        <div className="form-group">
                                        {prescription.fillDates.length === 0 && prescription.cancelDate === -1 ?
                                            <div>
                                            <button type = "button" 
                                                className = "btn btn-danger"
                                                style={{width: '8rem'}}
                                                id = {prescription.prescriptionID}
                                                onClick = {this.onCancelClick}>
                                                <span className="btn-inner--text">Cancel </span>
                                                <span><i className="fas fa-user-times"></i></span>
                                            </button>
                                            <button type = "button"
                                                className = "btn btn-success"
                                                style={{width: '8rem'}}
                                                id = {prescription.prescriptionID}
                                                onClick = {(e) => window.location.href=`/prescriptionEdit?ID=${e.target.id}`}>
                                                <span className="btn-inner--text">Edit </span>
                                                <span><i className="fas fa-edit"></i></span>
                                            </button>
                                            <button type = "button"
                                                className = "btn btn-primary"
                                                style={{width: '8rem'}}
                                                data-dismiss="modal">
                                                <span className="btn-inner--text">Dismiss </span>
                                                <span><i className="fas fa-external-link-alt"></i></span>
                                            </button>
                                            </div>
                                        : 
                                            <button type = "button"
                                                className = "btn btn-primary"
                                                style={{width: '8rem'}}
                                                data-dismiss="modal">
                                                <span className="btn-inner--text">Dismiss </span>
                                                <span><i className="fas fa-external-link-alt"></i></span>
                                            </button>
                                        }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                            <div className="modal-footer justify-content-center ">
                                <div className="row text-xs text-uppercase text-muted mb-0">
                                    <div className="col-auto"><i className="fas fa-file-prescription">&nbsp;</i> Prescription ID: {prescription.prescriptionID} </div>
                                    <div className="col-auto"><i className="fas fa-capsules">&nbsp;</i> Drug ID: {prescription.drugID}</div>
                                    <div className="col-auto"><i className="fas fa-user">&nbsp;</i> Patient ID: {prescription.patientID}</div>
                                    <div className="col-auto"><i className="fas fa-user-md">&nbsp;</i> Prescriber ID: {prescription.prescriberID}</div>
                                    <div className="col-auto"><i className="fas fa-hospital">&nbsp;</i> Dispenser ID: {prescription.dispenserID}</div>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                        </div>
                      }
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