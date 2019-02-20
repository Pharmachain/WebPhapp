import React, { Component } from "react";
import PropTypes from "prop-types";
  
class Prescription extends Component {
    // Displays all prescriptions for a patient
    displayPrescriptions = () => {
        return this.props.prescriptions.map(prescription => {
            var fillDates = Array.isArray(prescription.fillDates) && prescription.fillDates.length === 0 ? "Not Yet Filled" : prescription.fillDates.toString();
            var cancel = prescription.cancelled ? "Yes" : "No";
            var cancelDate = prescription.cancelDate === "" ? "TBD" : prescription.cancelDate; 

            return(
                <div className="card card-stats mb-4 ml-4" key={prescription.prescriptionID}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col">
                                <h5 className="card-title text-uppercase text-muted text-left mb-0">Prescription: &nbsp;
                                    <span className="h2 font-weight-bold mb-0">{prescription.prescriptionID}</span>
                                </h5>
                                <p class="mt-3 mb-0 text-muted text-sm text-left">
                                    <span class="text-nowrap">
                                        Date Written: {prescription.writtenDate}
                                        <br></br>
                                        Quantity: {prescription.quantity}
                                        <br></br>
                                        Days For: {prescription.daysFor}
                                        <br></br>
                                        Refills Left: {prescription.refillsLeft}
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


                        <div class="col-md-4">
                        <div class="modal fade" id="prescription-modal">
                        <div class="modal-dialog modal- modal-dialog-centered modal" role="document">
                            <div class="modal-content">
          
                            <div class="card-body px-lg-5 py-lg-5">
                            <div class="text-center text-muted mb-4">
                                <small>Or sign in with credentials</small>
                            </div>
                            <form role="form">
                                <div class="form-group mb-3">
                                    <div class="input-group input-group-alternative">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text"><i class="ni ni-email-83"></i></span>
                                        </div>
                                        <input class="form-control" placeholder="Email" type="email"/>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="input-group input-group-alternative">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text"><i class="ni ni-lock-circle-open"></i></span>
                                        </div>
                                        <input class="form-control" placeholder="Password" type="password"/>
                                    </div>
                                </div>
                                
                                <div class="text-center">
                                    <button type="button" class="btn btn-primary my-4">Sign in</button>
                                </div>
                            </form>
                            </div>
                            </div>
                        </div>
                        </div>
                        </div>
                    
                    </div>
                </div>

                // <tr key={prescription.prescriptionID}>
                //     <td> {prescription.prescriptionID} </td>
                //     <td> {prescription.patientID} </td>
                //     <td> {prescription.drugID} </td>
                //     <td>
                //         <button 
                //             type="button" 
                //             className="btn btn-primary"
                //             data-container="body"
                //             data-toggle="popover"
                //             data-trigger="hover"
                //             title="Fill Dates"
                //             data-placement="top"
                //             data-content={fillDates}>
                //             <span className="btn-inner--icon"><i className="ni ni-calendar-grid-58"></i></span>
                //         </button>
                //     </td>
                //     <td> {prescription.writtenDate} </td>
                //     <td> {prescription.quantity} </td>
                //     <td> {prescription.daysFor} </td>
                //     <td> {prescription.refillsLeft} </td>
                //     <td> {prescription.prescriberID} </td>
                //     <td> {prescription.dispenserID} </td>
                //     <td> {cancel} </td>
                //     <td> {cancelDate} </td>
                // </tr>
            )
        })
    }

    render() {
        return(
            // <table className="table table-hover">
            // <tbody>
            //   <tr className="table-primary">
            //     <th scope="col">Prescription ID</th>
            //     <th scope="col" >Patient ID</th>
            //     <th scope="col" >Drug ID</th>
            //     <th scope="col" >Filled Dates</th>
            //     <th scope="col">Written Date</th>
            //     <th scope="col" >Quantity</th>
            //     <th scope="col" >Days For</th>
            //     <th scope="col" >Refills Left</th>
            //     <th scope="col" >Prescriber ID</th>
            //     <th scope="col" >Dispenser ID</th>
            //     <th scope="col" >Cancelled</th>
            //     <th scope="col" >Cancel Date</th>
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