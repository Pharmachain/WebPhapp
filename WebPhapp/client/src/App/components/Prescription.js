import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "../style/custom-argon.css"

class Prescription extends Component {
    state = {isLoading: false,
             response: "n/a"};
     
    /*
    Testing onCancelClick
    Note: Use this onCancelClick function when NOT connected to blockchain
        - loading modals (followed by success or error modals) use sleep() to test correct modal rendering
        - otherwise modals are triggered instantaneously because loading times do not exist when not connected to blockchain
        - includes useful console.logs of loading and response states
    */
    // Gets the events id, to cancel the proper prescription.
    // onCancelClick = event => {
    //     const cancelModal = document.getElementById('modal-cancel');
    //     const cancelSuccessModal = document.getElementById('modal-cancel-success');
    //     const cancelErrorModal = document.getElementById('modal-cancel-error');
    //     const cancelQuery = `/api/v1/prescriptions/cancel/${event.currentTarget.id}`
    //     const sleep = (milliseconds) => { return new Promise(resolve => setTimeout(resolve, milliseconds)) }
    //     // 'X' or close button in prescription modal
    //     document.getElementById('close').click(); 
    //     console.log("cancel: before (loading, response): ", this.state.isLoading, this.state.response)
    //     axios
    //     .get(cancelQuery)
    //     .then(response => {
    //         // Cancel request is finished from backend and has a response
    //         this.setState({isLoading: false, response: response.status});
    //         console.log("cancel: after (loading, response): ", this.state.isLoading, this.state.response)
        
    //         sleep(5500).then(() => {
    //             if(this.state.response === 200) {
    //                 document.getElementById('cancel-success').click(); 
    //                 sleep(4000).then(() => {
    //                     cancelSuccessModal.style.display = "none";
    //                     window.location.reload()
    //                 })
    //             } else {
    //                 document.getElementById('cancel-error').click(); 
    //                 sleep(4000).then(() => {
    //                     cancelErrorModal.style.display = "none";
    //                     window.location.reload()
    //                 })
    //             }
    //         })
    //     }).catch(error => {
    //         // Prescription not cancelled because....
    //     });
    //     // Cancel request is loading on blockchain
    //     this.state.isLoading = true;
    //     console.log("cancel: during (loading, response): ", this.state.isLoading, this.state.response)
    //     sleep(5000).then(() => {
    //         cancelModal.style.display = "none";
    //     })
    // }

    /*
    Testing onRedeemClick
    Note: Use this onRedeemClick function when NOT connected to blockchain
        - loading modals (followed by success or error modals) use sleep() to test correct modal rendering
        - otherwise modals are triggered instantaneously because loading times do not exist when not connected to blockchain
        - includes useful console.logs of loading and response states
    */
    // Gets the events id, to redeem the proper prescription.
    // onRedeemClick = event => {
    //     const redeemModal = document.getElementById('modal-redeem');
    //     const redeemSuccessModal = document.getElementById('modal-redeem-success');
    //     const redeemErrorModal = document.getElementById('modal-redeem-error');
    //     const redeemQuery = `/api/v1/dispensers/redeem/${event.currentTarget.id}`
    //     const sleep = (milliseconds) => { return new Promise(resolve => setTimeout(resolve, milliseconds)) }
    //     // 'X' or close button in prescription modal
    //     document.getElementById('close').click(); 
    //     console.log("redeem: before (loading, response): ", this.state.isLoading, this.state.response)
    //     axios
    //     .get(redeemQuery)
    //     .then(response => {
    //         // Redeem request is finished from backend and has a response
    //         this.setState({isLoading: false, response: response.status});
    //         console.log("redeem: after (loading, response): ", this.state.isLoading, this.state.response)
        
    //         sleep(5500).then(() => {
    //             if(this.state.response === 200) {
    //                 document.getElementById('redeem-success').click(); 
    //                 sleep(4000).then(() => {
    //                     redeemSuccessModal.style.display = "none";
    //                     window.location.reload()
    //                 })
    //             } else {
    //                 document.getElementById('redeem-error').click(); 
    //                 sleep(4000).then(() => {
    //                     redeemErrorModal.style.display = "none";
    //                     window.location.reload()
    //                 })
    //             }
    //         })
    //     }).catch(error => {
    //         // Prescription not redeemed because....
    //     });
    //     // Redeem request is loading on blockchain
    //     this.state.isLoading = true;
    //     console.log("redeem: during (loading, response): ", this.state.isLoading, this.state.response)
    //     sleep(5000).then(() => {
    //         redeemModal.style.display = "none";
    //     })
    // }

    /*
    Production onRedeemClick
    Note: Use this onRedeemClick function when connected to blockchain
    */
    // Gets the events id, to redeem the proper prescription.
    onRedeemClick = event => {
        const redeemModal = document.getElementById('modal-redeem');
        const redeemSuccessModal = document.getElementById('modal-redeem-success');
        const redeemErrorModal = document.getElementById('modal-redeem-error');
        const redeemQuery = `/api/v1/dispensers/redeem/${event.currentTarget.id}`
        const sleep = (milliseconds) => { return new Promise(resolve => setTimeout(resolve, milliseconds)) }
        // 'X' or close button in prescription modal
        document.getElementById('close').click(); 
        axios
        .get(redeemQuery)
        .then(response => {
            // Redeem request is finished from backend and has a response
            this.setState({isLoading: false, response: response.status});           
            if(this.state.response === 200) {
                redeemModal.style.display = "none";
                document.getElementById('redeem-success').click(); 
                sleep(3000).then(() => {
                    redeemSuccessModal.style.display = "none";
                    window.location.reload()
                })
            } 
        }).catch(error => {
            // Prescription not redeemed because...
            redeemModal.style.display = "none";
            document.getElementById('redeem-error').click(); 
            sleep(3000).then(() => {
                redeemErrorModal.style.display = "none";
                window.location.reload()
            })
        });
        // Redeem request is loading on blockchain
        this.setState({isLoading: true});
    }
    
    /*
    Production onCancelClick
    Note: Use this onCancelClick function when connected to blockchain
    */
    // Gets the events id, to cancel the proper prescription.
    onCancelClick = event => {
        const cancelModal = document.getElementById('modal-cancel');
        const cancelSuccessModal = document.getElementById('modal-cancel-success');
        const cancelErrorModal = document.getElementById('modal-cancel-error');
        const cancelQuery = `/api/v1/prescriptions/cancel/${event.currentTarget.id}`
        const sleep = (milliseconds) => { return new Promise(resolve => setTimeout(resolve, milliseconds)) }
        // 'X' or close button in prescription modal
        document.getElementById('close').click(); 
        axios
        .get(cancelQuery)
        .then(response => {
            // Cancel request is finished from backend and has a response
            this.setState({isLoading: false, response: response.status});        
            if(this.state.response === 200) {
                cancelModal.style.display = "none";
                document.getElementById('cancel-success').click(); 
                sleep(3000).then(() => {
                    cancelSuccessModal.style.display = "none";
                    window.location.reload()
                })
            }
        }).catch(error => {
            // Prescription not cancelled because...
            cancelModal.style.display = "none";
            document.getElementById('cancel-error').click(); 
            sleep(3000).then(() => {
                cancelErrorModal.style.display = "none";
                window.location.reload()
            })
        });
        // Cancel request is loading on blockchain
        this.setState({isLoading: true});
    }

    // Displays all prescription cards for a patient
    displayPrescriptions = () => {
        // User role and id from log in
        const user = this.props.role; 
        const id = this.props.id;

        // Attributes of a prescription
        var prescriptionCount = -1;
        return this.props.prescriptions.map(prescription => {
            var writtenDate = prescription.writtenDate.split(" ", 4).join(" ");
            prescriptionCount += 1;
            return(
                <div className="card mb-4 ml-4"  key={prescription.prescriptionID} style={{width:'15rem'}}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col center">
                                <div className="row text-left">
                                    <div className="col text-left">
                                    <h5 className="card-title text-uppercase text-muted mb-0">
                                        Prescription:
                                        <br/>
                                        <span className="h3 font-weight-bold mb-0">
                                        {prescription.drugName}
                                        </span>
                                    </h5>
                                    </div>
                                    <div className="col text-right">
                                    <div className="icon icon-shape bg-default text-white rounded-circle shadow lg">
                                            <i className="fas fa-file-prescription"></i>
                                    </div>
                                    </div>
                                </div>
                                
                                <p className="mt-3 mb-0 text-muted text-sm text-left">
                                    <span className="text-nowrap">
                                        Quantity: {prescription.quantity}
                                        <br/>
                                        Days For: {prescription.daysFor}
                                        <br/>
                                        Refills Left: {prescription.refillsLeft}
                                        <br/>
                                        Date Written: {writtenDate}
                                    </span>
                                </p>
                                {/* Buttons for modal given certain users... */}
                                { user === 'Prescriber' && id === String(prescription.prescriberID) && prescription.refillsLeft > 0 && prescription.cancelDate === 0 ?
                                     <div className="btn-group mt-3">
                                        <br/>
                                        <button type = "button"
                                            className = "btn btn-primary text-white rounded-circle"
                                            id = {prescription.prescriptionID}
                                            onClick = {(e) => window.location.href=`/prescriptionEdit?ID=${e.currentTarget.id}`}
                                            style={{ width: '2.375rem', height: '2.375rem', padding: '0' }}>
                                            <span><i className="fas fa-pen-alt"></i></span>
                                        </button>
                                        &nbsp;
                                        &nbsp;
                                        <button type = "button"
                                            className = "btn btn-danger text-white rounded-circle"
                                            id = {prescription.prescriptionID}
                                            onClick = {this.onCancelClick}
                                            data-toggle="modal" 
                                            data-target="#modal-cancel"
                                            style={{ width: '2.375rem', height: '2.375rem', padding: '0' }}>
                                            <span><i className="fas fa-trash"></i></span>
                                        </button>
                                    </div>
                                    :
                                    user === 'Dispenser' && id === String(prescription.dispenserID) && prescription.refillsLeft > 0 && prescription.cancelDate === 0 ?
                                    <div>
                                        <br/>
                                        <button type = "button"
                                            className = "btn btn-success text-white rounded-circle"
                                            id={prescription.prescriptionID}
                                            onClick = {this.onRedeemClick}
                                            data-toggle="modal" 
                                            data-target="#modal-redeem"
                                            style={{ width: '2.375rem', height: '2.375rem', padding: '0' }}>
                                            <span><i className="fas fa-check"></i></span>
                                        </button>
                                        &nbsp;
                                        <button type = "button"
                                            className = "btn btn-primary text-white rounded-circle"
                                            id = {prescription.prescriptionID}
                                            onClick = {(e) => window.location.href=`/prescriptionEdit?ID=${e.currentTarget.id}`}
                                            style={{ width: '2.375rem', height: '2.375rem', padding: '0' }}>
                                            <span><i className="fas fa-pen-alt"></i></span>
                                        </button>
                                        &nbsp;
                                        <button type = "button"
                                            className = "btn btn-danger text-white rounded-circle"
                                            id = {prescription.prescriptionID}
                                            onClick = {this.onCancelClick}
                                            data-toggle="modal" 
                                            data-target="#modal-cancel"
                                            style={{ width: '2.375rem', height: '2.375rem', padding: '0' }}>
                                            <span><i className="fas fa-trash"></i></span>
                                        </button>
                                    </div>
                                    :
                                    user === 'Dispenser' || user === 'Prescriber' ?
                                    <div>
                                        {/* invisible button for equal height prescription cards */}
                                        <br/><div className = "rounded-circle" disabled style={{ width: '2.375rem', height: '2.375rem', padding: '0',  backgroundPosition: '0px' }}/>
                                    </div>
                                    : 
                                    "" }
                            </div>
                        </div>
                        <br/>
                        <button className="btn btn-icon btn-3 btn-outline-primary btn-block" type="button" data-toggle="modal" data-target="#prescription-modal" id={prescriptionCount} onClick={this.onClickViewPrescription}>
                            <span className="btn-inner--icon"><i className="ni ni-bullet-list-67"></i></span>
                            <span className="btn-inner--text">More Info</span>
                        </button>
                    </div>
                </div>
            )
        })
    }

    // Displays the prescription card modal for "more info" of a prescription
    onClickViewPrescription = (event) => {
        var prescriptionID = event.target.id || event.currentTarget.id;
        const modalPrescription = this.props.prescriptions[prescriptionID];
        this.setState({modalPrescription});
    }

    // Displays the table body for the fill dates of a prescription
    displayFillDates(fillDates){
        if (fillDates.length === 0) {
            return (
                <tr>
                    <td>{"-"}</td>
                    <td>{"N/A"}</td>
                </tr>
            )
        } else {
            return fillDates.map((date, index) =>
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{date}</td>
            </tr>
            );
        }
    }

    render() {
        // User role and id from log in
        const user = this.props.role; 
        const id = this.props.id;

        // Attributes of a prescription
        var prescription = this.state.modalPrescription;
        var drugName = (prescription && prescription.drugName) || "";
        var quantity = (prescription && prescription.quantity) || "";
        var daysFor = (prescription && prescription.daysFor) || "";
        var refillsLeft = prescription && prescription.refillsLeft;
        var daysBetween = prescription && prescription.daysBetween;
        var writtenDate = prescription && (prescription.writtenDate.split(" ", 4).join(" "));
        var cancelDate = prescription && (prescription.cancelDate <= 0 ? "N/A" : prescription.cancelDate.split(" ", 4).join(" "));
        var fillDates = prescription && prescription.fillDates;
        var dispenserID = prescription && prescription.dispenserID;
        var prescriberID = prescription && prescription.prescriberID;

        var fillDatesLength = prescription && prescription.fillDates.length;
        var formattedDates = [];
        for (var i = 0; i < fillDatesLength; i++){
            formattedDates.push(fillDates[i].split(" ", 4).join(" "));
        }    

        return(
            <div className="container justify-content-center">
                <div className="masonry align-items-left">
                    {this.displayPrescriptions()}
                    
                    {/* Modal that displays a loading screen for prescription cancelling */}
                    <div 
                        className="modal fade" 
                        id="modal-cancel" 
                        tabIndex="-1" 
                        role="dialog" 
                        data-keyboard="false"
                        data-backdrop="false"
                        style = {{ maxHeight: '100vh', height: '1000rem' }}>
                        <div className="modal-dialog modal-danger modal-dialog-centered modal-" role="document">
                            <div className="modal-content bg-gradient-danger">
                                <div className="modal-header">
                                    <h6 className="modal-title text-uppercase"><i className="fas fa-exclamation-circle">&nbsp;&nbsp;</i>Your attention is required</h6>
                                </div>
                                
                                <div className="modal-body">
                                    <div className="py-3 text-center">
                                        <div className="spinner-border text-white" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                        <h4 className="heading mt-4">Prescription <strong className="text-lg">Cancelling</strong> in Progress!</h4>
                                        <p>The prescription is being cancelled on Pharmachain. <br/> Please wait...</p>
                                    </div>  
                                </div>
                            </div>
                        </div>
                    </div>
                     {/* Modal and invisible button that displays success for prescription cancelling */}
                    <button type="button" className="btn btn-block btn-primary mb-3" data-toggle="modal" data-target="#modal-cancel-success" id="cancel-success" style={{ display: 'none' }}>Cancel: Success Modal</button>
                    <div 
                        className="modal fade" 
                        id="modal-cancel-success" 
                        tabIndex="-1" 
                        role="dialog" 
                        data-keyboard="false" 
                        data-backdrop="false"
                        style={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0)', 
                            maxHeight: '100vh', 
                            overflowY: 'auto', 
                            height: '1000rem', 
                            overflow: 'auto' }}>
                        <div className="modal-dialog modal-" role="document">
                            <div className="alert alert-success alert-dismissible fade show" role="alert">
                                <span className="alert-inner--icon"><i className="fas fa-check-circle"></i></span>
                                <span className="alert-inner--text"><strong> SUCCESS: </strong> Prescription <strong><u>cancelled</u></strong> on Pharmachain. Reloading page...</span>
                            </div>
                        </div>
                    </div>
                    {/* Modal and invisible button that displays error for prescription cancelling */}
                    <button type="button" className="btn btn-block btn-primary mb-3" data-toggle="modal" data-target="#modal-cancel-error" id="cancel-error" style={{ display: 'none' }}>Cancel: Error Modal</button>
                    <div 
                        className="modal fade" 
                        id="modal-cancel-error" 
                        tabIndex="-1" 
                        role="dialog"
                        data-keyboard="false" 
                        data-backdrop="false"
                        style={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0)', 
                            maxHeight: '100vh', 
                            overflowY: 'auto',
                            height: '1000rem', 
                            overflow: 'auto' }}>
                        <div className="modal-dialog modal-" role="document">
                            <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                <span className="alert-inner--icon"><i className="fas fa-bug"></i></span>
                                <span className="alert-inner--text"><strong> ERROR: </strong> Unable to <strong><u>cancel</u></strong> prescription on Pharmachain. Reloading page...</span>
                            </div>
                        </div>
                    </div>



                    {/* Modal that displays a loading screen for prescription redeeming */}
                    <div 
                        className="modal fade" 
                        id="modal-redeem" 
                        tabIndex="-1" 
                        role="dialog" 
                        data-keyboard="false"
                        data-backdrop="false"
                        style = {{ maxHeight: '100vh', height: '1000rem' }}>
                        <div className="modal-dialog modal-danger modal-dialog-centered modal-" role="document">
                            <div className="modal-content bg-gradient-success">
                                <div className="modal-header">
                                    <h6 className="modal-title text-uppercase"><i className="fas fa-exclamation-circle">&nbsp;&nbsp;</i>Your attention is required</h6>
                                </div>
                                <div className="modal-body">
                                    <div className="py-3 text-center">
                                        <div className="spinner-border text-white" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                        <h4 className="heading mt-4">Prescription <strong className="text-lg">Redeeming</strong> in Progress!</h4>
                                        <p>The prescription is being redeemed on Pharmachain. <br/> Please wait...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                     {/* Modal and invisible button that displays success for prescription redeeming */}
                    <button type="button" className="btn btn-block btn-primary mb-3" data-toggle="modal" data-target="#modal-redeem-success" id="redeem-success" style={{ display: 'none' }}>Redeem: Success Modal</button>
                    <div 
                        className="modal fade" 
                        id="modal-redeem-success" 
                        tabIndex="-1" 
                        role="dialog" 
                        data-keyboard="false" 
                        data-backdrop="false"
                        style={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0)', 
                            maxHeight: '100vh', 
                            overflowY: 'auto', 
                            height: '1000rem', 
                            overflow: 'auto' }}>
                        <div className="modal-dialog modal-" role="document">
                            <div className="alert alert-success alert-dismissible fade show" role="alert">
                                <span className="alert-inner--icon"><i className="fas fa-check-circle"></i></span>
                                <span className="alert-inner--text"><strong> SUCCESS: </strong> Prescription <strong><u>redeemed</u></strong> on Pharmachain. Reloading page...</span>
                            </div>
                        </div>
                    </div>
                    {/* Modal and invisible button that displays error for prescription redeeming */}
                    <button type="button" className="btn btn-block btn-primary mb-3" data-toggle="modal" data-target="#modal-redeem-error" id="redeem-error" style={{ display: 'none' }}>Redeem: Error Modal</button>
                    <div 
                        className="modal fade" 
                        id="modal-redeem-error" 
                        tabIndex="-1" 
                        role="dialog"
                        data-keyboard="false" 
                        data-backdrop="false"
                        style={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0)', 
                            maxHeight: '100vh', 
                            overflowY: 'auto', 
                            height: '1000rem', 
                            overflow: 'auto' }}>
                        <div className="modal-dialog modal-" role="document">
                            <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                <span className="alert-inner--icon"><i className="fas fa-bug"></i></span>
                                <span className="alert-inner--text"><strong> ERROR: </strong> Unable to <strong><u>redeem</u></strong> prescription on Pharmachain. Reloading page...</span>
                            </div>
                        </div>
                    </div>



                    {/* Modal that displays all prescription information */}
                    {<div className="col-md-2">
                    <div className="modal fade" tabIndex="-1" id="prescription-modal" data-backdrop="false" 
                        style={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0)', 
                            maxHeight: '100vh', 
                            height: '1000rem', 
                            overflowY: 'auto', 
                            overflow: 'auto', 
                            filter: 'drop-shadow(0 0 100rem rgba(0, 0, 0, 0.16)'
                            }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered modal" role="document" >
                        <div className="modal-content">

                        {/* Modal Header */}
                        <div className="modal-header">
                            <h3 className="modal-title text-muted" id="modal-title-default">Prescription:</h3> 
                            &nbsp; 
                            <h3 className="modal-title">{drugName}</h3>
                            <button type="button" className="close" id="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true"><i className="ni ni-fat-remove"></i></span>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="modal-body">
                        <div className="row">
                            <div className="col-md-5 pl-4 bg-secondary shadow" style={{ height: '28rem', overflow: 'auto' }}>
                                <div className="card card-stats mb-4 mb-lg-0">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col">
                                                <h5 className="card-title text-uppercase text-muted mb-0 text-left">Quantity:</h5>
                                                <span className="h3 font-weight-bold mb-0 offset-1">{quantity}</span>
                                            </div>
                                            <div className="col-auto">
                                            <div className="icon icon-shape bg-default text-white rounded-circle shadow">
                                                <i className="fas fa-pills"></i>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <br/>
                                <div className="card card-stats mb-4 mb-lg-0">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col">
                                                <h5 className="card-title text-uppercase text-muted mb-0 text-left">Total Days Valid:</h5>
                                                <span className="h3 font-weight-bold mb-0 offset-1">{daysFor}</span>
                                            </div>
                                            <div className="col-auto">
                                            <div className="icon icon-shape bg-default text-white rounded-circle shadow">
                                                <i className="ni ni-calendar-grid-58"></i>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <br/>
                                <div className="card card-stats mb-4 mb-lg-0">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col">
                                                <h5 className="card-title text-uppercase text-muted mb-0 text-left">Refills Left:</h5>
                                                <span className="h3 font-weight-bold mb-0 offset-1">{refillsLeft}</span>
                                            </div>
                                            <div className="col-auto">
                                            <div className="icon icon-shape bg-default text-white rounded-circle shadow">
                                                <i className="fas fa-prescription-bottle"></i>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <br/>
                                <div className="card card-stats mb-4 mb-lg-0">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col">
                                                <h5 className="card-title text-uppercase text-muted mb-0 text-left">Days Until Next Refill:</h5>
                                                <span className="h3 font-weight-bold mb-0 offset-1">{daysBetween}</span>
                                            </div>
                                            <div className="col-auto">
                                            <div className="icon icon-shape bg-default text-white rounded-circle shadow">
                                                <i className="fas fa-hourglass-half"></i>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <br/>
                                <div className="card card-stats mb-4 mb-lg-0">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col">
                                                <h5 className="card-title text-uppercase text-muted mb-0 text-left">Written Date:</h5>
                                                <span className="h3 font-weight-bold mb-0 offset-1">{writtenDate}</span>
                                            </div>
                                            <div className="col-auto">
                                            <div className="icon icon-shape bg-default text-white rounded-circle shadow">
                                                <i className="fas fa-user-edit"></i>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <br/>
                                <div className="card card-stats mb-4 mb-lg-0">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col">
                                                <h5 className="card-title text-uppercase text-muted mb-0 text-left">Date Cancelled:</h5>
                                                <span className="h3 font-weight-bold mb-0 offset-1">{cancelDate}</span>
                                            </div>
                                            <div className="col-auto">
                                                <div className="icon icon-shape bg-default text-white rounded-circle shadow">
                                                    <i className="fas fa-ban"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Refill Dates Table */}
                            <div className="col-md-7 pr-4">
                                <div className="card shadow" style={{ height: '28rem', overflow: 'auto' }}>
                                    <div className="card-header border-0">
                                    <h4 className="mb-0 text-left">Past Refill Dates</h4>
                                    </div>
                                    <div className="table-responsive">
                                    <table className="table align-items-center table-border table-flush">
                                        <thead className="thead-light">
                                        <tr>
                                            <th scope="col">Refill Number</th>
                                            <th scope="col">Date</th>
                                        </tr>
                                        </thead>
                                        <tbody>    
                                            {this.displayFillDates(formattedDates)}
                                        </tbody>
                                    </table>
                                    </div>
                                </div>
                            </div>

                            </div>

                            {/* Buttons for modal given certain users... */}
                            <div className="row justify-content-center form-inline">
                                <div className="form-group">                                        
                                { user === 'Prescriber' && id === String(prescriberID)  && prescription && refillsLeft > 0 && prescription.cancelDate === 0 ?
                                    <div className="btn-group">
                                    <button type = "button"
                                        className = "btn icon icon-shape bg-primary text-white rounded-circle"
                                        id = {prescription.prescriptionID}
                                        onClick = {(e) => window.location.href=`/prescriptionEdit?ID=${e.currentTarget.id}`}
                                        tooltip="Edit Prescription" 
                                        tooltip-position="top"
                                        tooltip-color="primary">
                                        <span><i className="fas fa-pen-alt ni-3x"></i></span>
                                    </button>
                                    &nbsp;
                                    &nbsp;
                                    &nbsp;
                                    <button type = "button"
                                        className = "btn icon icon-shape bg-danger text-white rounded-circle"
                                        id = {prescription.prescriptionID}
                                        onClick = {this.onCancelClick}
                                        data-toggle="modal" 
                                        data-target="#modal-cancel"
                                        tooltip="Cancel Prescription" 
                                        tooltip-position="top"
                                        tooltip-color="danger">
                                        <span><i className="fas fa-trash"></i></span>
                                    </button>
                                    </div>
                                    :
                                    user === 'Dispenser' && id === String(dispenserID) && prescription && refillsLeft > 0 && prescription.cancelDate === 0 ?
                                    <div className="btn-group">
                                    <button type = "button"
                                        className = "btn icon icon-shape bg-success text-white rounded-circle"
                                        id={prescription.prescriptionID}
                                        onClick = {this.onRedeemClick}
                                        data-toggle="modal" 
                                        data-target="#modal-redeem"
                                        tooltip="Redeem Prescription" 
                                        tooltip-position="top">
                                        <span><i className="fas fa-check"></i></span>
                                    </button>
                                    &nbsp;
                                    &nbsp;
                                    &nbsp;
                                    <button type = "button"
                                        className = "btn icon icon-shape bg-primary text-white rounded-circle"
                                        id = {prescription.prescriptionID}
                                        onClick = {(e) => window.location.href=`/prescriptionEdit?ID=${e.currentTarget.id}`}
                                        tooltip="Edit Prescription" 
                                        tooltip-position="top">
                                        <span><i className="fas fa-pen-alt"></i></span>
                                    </button>
                                    &nbsp;
                                    &nbsp;
                                    &nbsp;
                                    <button type = "button"
                                        className = "btn icon icon-shape bg-danger text-white rounded-circle"
                                        id = {prescription.prescriptionID}
                                        onClick = {this.onCancelClick}
                                        data-toggle="modal" 
                                        data-target="#modal-cancel"
                                        tooltip="Cancel Prescription" 
                                        tooltip-position="top">
                                        <span><i className="fas fa-trash"></i></span>
                                    </button>
                                    </div>
                                    :
                                    "" }
                                </div>
                            </div>
                        </div>
                        
                        {/* Modal Footer */}
                        <div className="modal-footer justify-content-center mt-0">
                            <div className="row text-xs text-uppercase text-muted mb-0">
                                <div className="col-auto"><i className="fas fa-file-prescription">&nbsp;</i> Prescription ID: {(prescription && prescription.prescriptionID) || ""} </div>
                                <div className="col-auto"><i className="fas fa-capsules">&nbsp;</i> Drug ID: {(prescription && prescription.drugID) || ""}</div>
                                <div className="col-auto"><i className="fas fa-user">&nbsp;</i> Patient ID: {(prescription && prescription.patientID) || ""}</div>
                                <div className="col-auto"><i className="fas fa-user-md">&nbsp;</i> Prescriber ID: {(prescription && prescription.prescriberID) || ""}</div>
                                <div className="col-auto"><i className="fas fa-hospital-alt">&nbsp;</i> Dispenser ID: {(prescription && prescription.dispenserID) || ""}</div>
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
            quantity: PropTypes.string.isRequired,
            daysFor: PropTypes.number.isRequired,
            refillsLeft: PropTypes.number.isRequired,
            daysBetween: PropTypes.number.isRequired,
            prescriberID: PropTypes.number.isRequired,
            dispenserID: PropTypes.number.isRequired,
            cancelDate: PropTypes.number.isRequired,
        }).isRequired,
    ),
  };

export default Prescription;
