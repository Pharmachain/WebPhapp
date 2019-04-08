import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Error from './Error';

class PrescriptionAdd extends Component {
  // Initialize the state
  state = {
    patientID: 0,
    drugID:0,
    quantity: "",
    daysFor: 0,
    refillsLeft: 0,
    prescriberID: 0,
    dispenserID: 0,
    message: '',

    isLoading: false,
    response: "n/a"
  };

  // Updating value in the patientID state
  onKeyDownPatientID = event => {
    this.setState({patientID: event.target.value});
  }

  /* Seperate component for this to validate it... */
  // Updating value in the drugID state
  onKeyDownDrugID = event => {
    this.setState({drugID: event.target.value});
  }

  // Updating value in the quantity state
  onKeyDownQuantity = event => {
    this.setState({quantity: event.target.value});
  }

  // Updating value in the days daysFor state
  onKeyDownDaysFor = event => {
    this.setState({daysFor: event.target.value});
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
  Testing onAddClick
  Note: Use this onAddClick function when NOT connected to blockchain
      - loading modals (followed by success or error modals) use sleep() to test correct modal rendering
      - otherwise modals are triggered instantaneously because loading times do not exist when not connected to blockchain
      - includes useful console.logs of loading and response states
  */
  // // Sending the prescription to be added
  // onAddClick = () => {
  //   const addModal = document.getElementById('modal-add');
  //   const addSuccessModal = document.getElementById('modal-add-success');
  //   const addErrorModal = document.getElementById('modal-add-error');
  //   var addQuery= `/api/v1/prescriptions/add`;
  //   const sleep = (milliseconds) => { return new Promise(resolve => setTimeout(resolve, milliseconds)) }
  //   const id = this.props.id;

  //   this.setState({prescriberID: id});

  //   console.log("edit: before (loading, response): ", this.state.isLoading, this.state.response)
  //   /* Send a message back for an error or a success */
  //   axios
  //   .post(addQuery,{
  //       "patientID": this.state.patientID,
  //       "drugID": this.state.drugID,
  //       "quantity": this.state.quantity,
  //       "daysFor": this.state.daysFor,
  //       "refillsLeft": this.state.refillsLeft,
  //       "prescriberID": this.state.prescriberID,
  //       "dispenserID": this.state.dispenserID
  //   })
  //   .then(response => {
  //     // Add request is finished from backend and has a response
  //     this.setState({isLoading: false, response: response.status});
  //     console.log("add: after (loading, response): ", this.state.isLoading, this.state.response)

  //     sleep(5500).then(() => {
  //         if(this.state.response === 200) {
  //             document.getElementById('add-success').click(); 
  //             sleep(4000).then(() => {
  //                 addSuccessModal.style.display = "none";
  //                 window.location.reload()
  //             })
  //         } else {
  //             document.getElementById('add-error').click(); 
  //             sleep(4000).then(() => {
  //                 addErrorModal.style.display = "none";
  //                 window.location.reload()
  //             })
  //         }
  //     })
  //   }).catch(error => {
  //       // Prescription not added because...
  //   });
  //   // Add request is loading on blockchain
  //   this.state.isLoading = true;
  //   console.log("add: during (loading, response): ", this.state.isLoading, this.state.response)
  //   sleep(5000).then(() => {
  //       addModal.style.display = "none";
  //   })
  // }

  /*
  Production onAddClick
  Note: Use this onAddClick function when connected to blockchain
  */
  // Sending the prescription to be added
  onAddClick = () => {
    const addModal = document.getElementById('modal-add');
    const addSuccessModal = document.getElementById('modal-add-success');
    const addErrorModal = document.getElementById('modal-add-error');
    var addQuery= `/api/v1/prescriptions/add`;
    const sleep = (milliseconds) => { return new Promise(resolve => setTimeout(resolve, milliseconds)) }
    const id = this.props.id;

    this.setState({prescriberID: id});
    /* Send a message back for an error or a success */
    axios
    .post(addQuery,{
        "patientID": this.state.patientID,
        "drugID": this.state.drugID,
        "quantity": this.state.quantity,
        "daysFor": this.state.daysFor,
        "refillsLeft": this.state.refillsLeft,
        "prescriberID": this.state.prescriberID,
        "dispenserID": this.state.dispenserID
    })
    .then(response => {
      // Add request is finished from backend and has a response
      this.setState({isLoading: false, response: response.status});
      if(this.state.response === 200) {
          document.getElementById('add-success').click(); 
          sleep(4000).then(() => {
              addSuccessModal.style.display = "none";
              window.location.reload()
          })
      } else {
          document.getElementById('add-error').click(); 
          sleep(4000).then(() => {
              addErrorModal.style.display = "none";
              window.location.reload()
          })
      }
    }).catch(error => {
        // Prescription not added because...
    });
    // Add request is loading on blockchain
    this.state.isLoading = true;
    addModal.style.display = "none";
  }

  render() {
    // User role from log in
    const user = this.props.role; 
    return (
      <div>
      {user === 'Prescriber' || user === 'Admin' ?
      <div className="App">
        {/* Modal that displays a loading screen for prescription adding */}
        <div 
            className="modal fade" 
            id="modal-add" 
            tabIndex="-1" 
            role="dialog" 
            data-keyboard="false"
            data-backdrop="false"
            style = {{ maxHeight: '100vh', height: '1000rem' }}>
            <div className="modal-dialog modal-primary modal-dialog-centered modal-" role="document">
                <div className="modal-content bg-gradient-success">
                    <div className="modal-header">
                        <h6 className="modal-title text-uppercase"><i className="fas fa-exclamation-circle">&nbsp;&nbsp;</i>Your attention is required</h6>
                    </div>
                    
                    <div className="modal-body">
                        <div className="py-3 text-center">
                            <div className="spinner-border text-white" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                            <h4 className="heading mt-4">Prescription <strong className="text-lg">Adding</strong> in Progress!</h4>
                            <p>The prescription is being added to Pharmachain. <br/> Please wait...</p>
                        </div>  
                    </div>
                </div>
            </div>
        </div>
        {/* Modal and invisible button that displays success for prescription adding */}
        <button type="button" className="btn btn-block btn-primary mb-3" data-toggle="modal" data-target="#modal-add-success" id="add-success" style={{ display: 'none' }}>Add: Success Modal</button>
        <div 
            className="modal fade" 
            id="modal-add-success" 
            tabIndex="-1" 
            role="dialog" 
            data-keyboard="false" 
            data-backdrop="false"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0)', maxHeight: '100vh', overflowY: 'auto' }}>
            <div className="modal-dialog modal-" role="document">
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <span className="alert-inner--icon"><i className="fas fa-check-circle"></i></span>
                    <span className="alert-inner--text"><strong> SUCCESS: </strong> Prescription successfully <strong><u>added</u></strong> to Pharmachain. Reloading page...</span>
                </div>
            </div>
        </div>
        {/* Modal and invisible button that displays error for prescription adding */}
        <button type="button" className="btn btn-block btn-primary mb-3" data-toggle="modal" data-target="#modal-add-error" id="add-error" style={{ display: 'none' }}>Add: Error Modal</button>
        <div 
            className="modal fade" 
            id="modal-add-error" 
            tabIndex="-1" 
            role="dialog"
            data-keyboard="false" 
            data-backdrop="false"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0)', maxHeight: '100vh', overflowY: 'auto' }}>
            <div className="modal-dialog modal-" role="document">
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <span className="alert-inner--icon"><i className="fas fa-bug"></i></span>
                    <span className="alert-inner--text"><strong> ERROR: </strong> Unable to <strong><u>add</u></strong> prescription to Pharmachain. Reloading page...</span>
                </div>
            </div>
        </div>

        <div className="bg-gradient-primary py-7 py-xl-8 b-10"></div>
        <section className="section section-lg pt-lg-0 mt--200 m-5">

        <div className="col-xl-8 order-xl-1 center">
        <div className="card bg-secondary shadow">
          <div className="card-header bg-white border-0">
              <div className="row align-items-center">
                <div className="col-8 text-left">
                  <h3 className="mb-0">Prescription Add</h3>
                </div>
              </div>
          </div>
          <div className="card-body text-left">
          <form>
            <div className="pl-lg-4"> </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group focused">
                <label className="form-control-label">Patient ID:</label>
                  <input
                  type="p"
                  className="form-control"
                  placeholder="Enter the patient's ID"
                  onChange={this.onKeyDownPatientID}/>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group focused">
                <label className="form-control-label">Drug ID:</label>
                  <input
                  type="p"
                  className="form-control"
                  placeholder="Enter the drug's ID"
                  onChange={this.onKeyDownDrugID}/>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group focused">
                <label className="form-control-label">Dispenser ID:</label>
                  <input
                  type="p"
                  className="form-control"
                  placeholder="Enter the dispenser's ID"
                  onChange={this.onKeyDownDispenserID}/>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group focused">
                <label className="form-control-label">Quantity:</label>
                  <input
                  type="p"
                  className="form-control"
                  placeholder="Enter the quantity"
                  onChange={this.onKeyDownQuantity}/>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group focused">
                <label className="form-control-label">Days For:</label>
                  <input
                  type="p"
                  className="form-control"
                  placeholder="Enter the number of days for"
                  onChange={this.onKeyDownDaysFor}/>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group focused">
                <label className="form-control-label">Refills Left:</label>
                  <input
                  type="p"
                  className="form-control"
                  placeholder="Enter the number of refills left"
                  onChange={this.onKeyDownRefillsLeft}/>
                </div>
              </div>

            </div>
          </form>
          <Link to={"/"}>
                <button
                  type="button"
                  className="btn btn-danger my-4"
                  variant="raised">
                  Cancel
                </button>
          </Link>
          &nbsp;
          <button
            type="button"
            className="btn btn-success my-4"
            data-toggle="modal"
            data-target="#modal-add"
            onClick={this.onAddClick}>
            Add Prescription
          </button>
          </div>
          </div>
        </div>

        </section>
      </div>
      : 
      <Error/> }
    </div>
    );
  }
}

export default PrescriptionAdd;
