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
                <div className="card card-stats mb-4" key={prescription.prescriptionID}>
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
                            <div className="col-auto">
                                <div className="icon icon-shape bg-default text-white rounded-circle shadow left">
                                    <i class="fas fa-file-prescription"></i>
                                </div>
                            </div>
                        </div>
                        {/* <a href="#" class="btn btn-primary">More</a> */}
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
            
            <div className="container-fluid">
            <div className="header-body">
            <div className="card-columns">
                {this.displayPrescriptions()}
            </div>
            </div>
            </div>
            // </tbody>
            // </table>  
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