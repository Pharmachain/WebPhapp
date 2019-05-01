import React, { Component } from "react";
import axios from "axios";
import qs from 'qs';
import Error from './Error';

class PrescriptionEdit extends Component {
    constructor(props){
        super(props);
            this.state = {
                cancelDate: "",
                isLoading: false,
                response: "n/a"
            };
    const querystring = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
    const prescriptionNo = querystring.ID;

    axios
      .get(`/api/v1/prescriptions/single/${prescriptionNo}`)
      .then(results => results.data)
      .then(prescription => this.setState({
            patientID: prescription.patientID,
            prescriptionID: prescription.prescriptionID,
            drugID: prescription.drugID,
            fillDates: prescription.fillDates,
            writtenDate: prescription.writtenDate,
            quantity: prescription.quantity,
            daysFor: prescription.daysFor,
            refillsLeft: prescription.refillsLeft,
            prescriberID: prescription.prescriberID,
            dispenserID: prescription.dispenserID,
            cancelled: prescription.cancelled,
            cancelDate: prescription.cancelDate,
            daysBetween: prescription.daysBetween
      }));
  }

  // Updating value in the quantity state
  onKeyDownQuantity = event => {
    this.setState({quantity: event.target.value});
  }

  // Updating value in the days daysFor state
  onKeyDownDaysFor = event => {
    this.setState({daysFor: event.target.value});
  }

  // Updating value in the daysBetween state
  onKeyDownDaysBetween = event => {
    this.setState({daysBetween: event.target.value});
  }

  // Updating value in the refillsLeft state
  onKeyDownRefillsLeft = event => {
    this.setState({refillsLeft: event.target.value});
  }

  // Updating value in the dispenserID state
  onKeyDownDispenserID = event => {
    this.setState({dispenserID: event.target.value});
  }

  /*
  Testing onEditClick
  Note: Use this onEditClick function when NOT connected to blockchain
      - loading modals (followed by success or error modals) use sleep() to test correct modal rendering
      - otherwise modals are triggered instantaneously because loading times do not exist when not connected to blockchain
      - includes useful console.logs of loading and response states
  */
  // // Sending the prescription to be edited
  // onEditClick = () => {
  //   const editModal = document.getElementById('modal-edit');
  //   const editSuccessModal = document.getElementById('modal-edit-success');
  //   const editErrorModal = document.getElementById('modal-edit-error');
  //   var editQuery = `/api/v1/prescriptions/edit`;
  //   const sleep = (milliseconds) => { return new Promise(resolve => setTimeout(resolve, milliseconds)) }

  //   console.log("edit: before (loading, response): ", this.state.isLoading, this.state.response)
  //   axios
  //   .post(editQuery,{
  //     "prescriptionID": this.state.prescriptionID,
  //     "quantity": this.state.quantity,
  //     "daysFor": this.state.daysFor,
  //     "refillsLeft": this.state.refillsLeft,
  //     "dispenserID": this.state.dispenserID
  //   })
  //   .then(response => {
  //       // Edit request is finished from backend and has a response
  //       this.setState({isLoading: false, response: response.status});
  //       console.log("edit: after (loading, response): ", this.state.isLoading, this.state.response)

  //       sleep(5500).then(() => {
  //           if(this.state.response === 200) {
  //               document.getElementById('edit-success').click(); 
  //               sleep(4000).then(() => {
  //                   editSuccessModal.style.display = "none";
  //                   window.location.href = "./patient?ID=" + this.state.patientID;
  //               })
  //           } else {
  //               document.getElementById('edit-error').click(); 
  //               sleep(4000).then(() => {
  //                   editErrorModal.style.display = "none";
  //                   window.location.href = "./patient?ID=" + this.state.patientID;
  //               })
  //           }
  //       })
  //   }).catch(error => {
  //       // Prescription not edited because...
  //   });
  //   // Edit request is loading on blockchain
  //   this.setState({isLoading: true});
  //   console.log("edit: during (loading, response): ", this.state.isLoading, this.state.response)
  //   sleep(5000).then(() => {
  //       editModal.style.display = "none";
  //   })
  // }

  /*
  Production onEditClick
  Note: Use this onEditClick function when connected to blockchain
  */
  // Sending the prescription to be edited
  onEditClick = () => {
    const editModal = document.getElementById('modal-edit');
    const editSuccessModal = document.getElementById('modal-edit-success');
    const editErrorModal = document.getElementById('modal-edit-error');
    var editQuery = `/api/v1/prescriptions/edit`;
    const sleep = (milliseconds) => { return new Promise(resolve => setTimeout(resolve, milliseconds)) }
    axios
    .post(editQuery,{
      "prescriptionID": this.state.prescriptionID,
      "quantity": this.state.quantity,
      "daysFor": this.state.daysFor,
      "refillsLeft": this.state.refillsLeft,
      "dispenserID": this.state.dispenserID,
      "daysBetween": this.state.daysBetween
    })
    .then(response => {
        // Edit request is finished from backend and has a response
        this.setState({isLoading: false, response: response.status});
        if(this.state.response === 200) {
            editModal.style.display = "none";
            document.getElementById('edit-success').click(); 
            sleep(4000).then(() => {
                editSuccessModal.style.display = "none";
                window.location.href = "./patient?ID=" + this.state.patientID;
            })
        }
    }).catch(error => {
        // Prescription not edited because...
        editModal.style.display = "none";
        document.getElementById('edit-error').click(); 
        sleep(4000).then(() => {
            editErrorModal.style.display = "none";
            window.location.href = "./patient?ID=" + this.state.patientID;
        })
    });
    // Edit request is loading on blockchain
    this.setState({isLoading: true});
  }

  render() {
    // User role from log in
    const user = this.props.role;
    return (
    <div>
      {user === 'Prescriber' || user === 'Dispenser' || user === 'Admin' ?
      <div className="App">
        {/* Modal that displays a loading screen for prescription editing */}
        <div 
            className="modal fade" 
            id="modal-edit" 
            tabIndex="-1" 
            role="dialog" 
            data-keyboard="false"
            data-backdrop="false"
            style = {{ maxHeight: '100vh', height: '1000rem' }}>
            <div className="modal-dialog modal-primary modal-dialog-centered modal-" role="document">
                <div className="modal-content bg-gradient-primary">
                    <div className="modal-header">
                        <h6 className="modal-title text-uppercase"><i className="fas fa-exclamation-circle">&nbsp;&nbsp;</i>Your attention is required</h6>
                    </div>
                    
                    <div className="modal-body">
                        <div className="py-3 text-center">
                            <div className="spinner-border text-white" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                            <h4 className="heading mt-4">Prescription <strong className="text-lg">Editing</strong> in Progress!</h4>
                            <p>The prescription is being edited on Pharmachain. <br/> Please wait...</p>
                        </div>  
                    </div>
                </div>
            </div>
        </div>
        {/* Modal and invisible button that displays success for prescription editing */}
        <button type="button" className="btn btn-block btn-primary mb-3" data-toggle="modal" data-target="#modal-edit-success" id="edit-success" style={{ display: 'none' }}>Edit: Success Modal</button>
        <div 
            className="modal fade" 
            id="modal-edit-success" 
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
                    <span className="alert-inner--text"><strong> SUCCESS: </strong> Prescription <strong><u>edited</u></strong> on Pharmachain. Navigating to previous page...</span>
                </div>
            </div>
        </div>
        {/* Modal and invisible button that displays error for prescription editing */}
        <button type="button" className="btn btn-block btn-primary mb-3" data-toggle="modal" data-target="#modal-edit-error" id="edit-error" style={{ display: 'none' }}>Edit: Error Modal</button>
        <div 
            className="modal fade" 
            id="modal-edit-error" 
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
                    <span className="alert-inner--text"><strong> ERROR: </strong> Unable to <strong><u>edit</u></strong> prescription on Pharmachain. Reloading page...</span>
                </div>
            </div>
        </div>

      { this.state.cancelDate === "" ? "" :
        this.state.cancelDate === 0 && this.state.refillsLeft >= 0 ?
        

        <div>
        <div className="bg-gradient-primary py-7 py-xl-8 b-10"></div>
        <section className="section section-lg pt-lg-0 mt--200 m-5">

        <div className="col-xl-8 order-xl-1 center">
        <div className="card bg-secondary shadow">
          <div className="card-header bg-white border-0">
              <div className="row align-items-center">
                <div className="col-8 text-left">
                  <h3 className="mb-0">Edit Prescription</h3>
                </div>
              </div>
          </div>
          <div className="card-body text-left">
          <form>
            <div className="pl-lg-4">
            <div className="row">
              <div className="col-lg">
                <div className="form-group focused">
                  <label className="form-control-label">Prescription ID:</label>
                  <input disabled
                  type="p"
                  className="form-control"
                  placeholder={this.state.prescriptionID}/>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group focused">
                  <label className="form-control-label">Patient ID:</label>
                  <input disabled
                  type="p"
                  className="form-control"
                  placeholder={this.state.patientID}
                  onChange={this.onKeyDownPatientID}/>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group focused">
                  <label className="form-control-label">Drug ID:</label>
                  <input disabled
                  type="p"
                  placeholder={this.state.drugID}
                  className="form-control"/>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group focused">
                  <label className="form-control-label">Prescriber ID:</label>
                  <input disabled
                  type="p"
                  className="form-control"
                  placeholder={this.state.prescriberID}/>
                </div>
              </div>
            </div>
            <hr className="my-4"></hr>
            <div className="row">
              <div className="col-lg-6">
                <div className="form-group focused">
                  <label className="form-control-label">Dispenser ID:</label>
                  <input
                  type="p"
                  className="form-control"
                  placeholder="Enter the dispenser's ID"
                  value = {this.state.dispenserID}
                  onChange={this.onKeyDownDispenserID}/>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group focused">
                  <label className="form-control-label">Quantity:</label>
                  <input
                  type="p"
                  className="form-control"
                  placeholder="Enter the quantity"
                  value = {this.state.quantity}
                  onChange={this.onKeyDownQuantity}/>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group focused">
                  <label className="form-control-label">Total Days Valid:</label>
                  <input
                  type="p"
                  className="form-control"
                  placeholder="Enter the number of days"
                  value = {this.state.daysFor}
                  onChange={this.onKeyDownDaysFor}/>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group focused">
                  <label className="form-control-label">Days Until Next Refill:</label>
                  <input
                  type="p"
                  className="form-control"
                  placeholder="Enter the number of days"
                  value = {this.state.daysBetween}
                  onChange={this.onKeyDownDaysBetween}/>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group focused">
                  <label className="form-control-label">Refills Left:</label>
                  <input
                  type="p"
                  className="form-control"
                  placeholder="Enter the number of refills left"
                  value = {this.state.refillsLeft}
                  onChange={this.onKeyDownRefillsLeft}/>
                </div>
              </div>
            </div>

            <br/>
          <br/>

          <div className="row">
            <div className="col-md-6">
              <button
                type="button"
                className="btn btn-icon btn-block btn-danger"
                onClick={() => window.history.go(-1)}>
                <span><i className="fas fa-times"></i></span>
                &nbsp;&nbsp;Cancel
              </button>
            &nbsp;
            </div>

            <div className="col-md-6">
            <button 
              className="btn btn-icon btn-block btn-primary" 
              type="button"
              data-toggle="modal"
              data-target="#modal-edit"
              onClick={this.onEditClick}>
              <span><i className="fas fa-pen-alt"></i></span>
              &nbsp;&nbsp;Done
            </button>

            </div>
            </div>
            </div>
          </form>
          </div>
        </div>
        </div>

        </section>
        </div>
        :
        <div className="col-8 center">
          <div className="alert alert-warning" role="alert">
            <span className="alert-inner--text"><strong>WARNING: </strong> Unable to edit. The prescription may have been fulfilled or cancelled.</span>
          </div>
        </div>
      }
      </div>
      :
      <Error/> }
    </div>
    );
  }
}

export default PrescriptionEdit;
