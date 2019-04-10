import React, { Component } from "react";
import { withRouter } from 'react-router-dom'
import axios from "axios";
import qs from 'qs';
import Prescription from "../components/Prescription";
import Error from "./Error";

class Patient extends Component {
    // Initialize the state
    state = {
        patientID: 0,
        first: "",
        last: "",
        dob: "",
        prescriptions: [],
        isFetching: true,
        validPatient: true //TODO
    };

    // Fetch the prescription on first mount
    componentDidMount() {
        this.getPrescriptions();
        this.getPatientInfo();
    }

    // Retrieves the items in a prescription from the Express app
    // ex. api/v1/prescriptions/01
    getPrescriptions = () => {
        // Gets parameter from the URL of 'ID'
        const querystring = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
        const patientID = querystring.ID;
        this.setState({patientID});

        axios
            // String interpolation.
            .get(`/api/v1/prescriptions/${patientID}`)
            .then(results => results.data)
            .then(prescriptions => this.setState({ prescriptions, isFetching: false }));
    };

    // Retrieves the patient information from the Express app
    // ex. api/v1/patients/1
    getPatientInfo = () => {
        // Gets parameter from the URL of 'ID'
        const querystring = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
        const patientID = querystring.ID;

        axios
            // String interpolation
            .get(`api/v1/patients/${patientID}`)
            .then(results => results.data)
            .then(patientInfo => this.setState({ first: patientInfo['first'], last: patientInfo['last'], dob: patientInfo['dob'] }));
    }

    // displayPrescriptions() displays the properties of a prescription using Prescription
    // @return: returns all prescriptions for a patient id
    displayPrescriptions = () => {
    return(
        <Prescription
        prescriptions = {this.state.prescriptions}
        getPrescriptions = {this.getPrescriptions}
        role = {this.props.role} 
        id = {this.props.id} />
        )
    }

    render() {
        // User role from log in
        const user = this.props.role; 
        const prescriptions = this.state.prescriptions;
        const {isFetching} = this.state;
        
        return (
            /* Logic to render prescriptions or warning conditionally */
            <div>
            {user === 'Patient' || user === 'Prescriber' || user === 'Dispenser' || user === 'Government' || user === 'Admin' ?
            <div>
            { isFetching ? ""
                :          
                /* Check to see if any prescriptions are found */
                !isFetching ?
                <div>
                <div className="bg-gradient-primary py-7 py-xl-8 b-10"></div>
                <section className="section section-lg pt-lg-0 mt--200 m-5">
                <div className="col-xl-12 order-xl-1 center">
                    <div className="card bg-secondary shadow">
                    <div className="card-header bg-white border-0">
                        <div className="row align-items-center">
                            <div className="col-8 text-left">
                            <h3 className="mb-0 text-capitalize">{this.state.first}'s Prescriptions</h3>
                            </div>
                        </div>
                        <br/>
                        <div className="col-lg-6">
                        <div className="card-body py-2">
                            <div className="icon icon-shape icon-shape-primary rounded-circle mb-4">
                                <i className="fas fa-user"></i>
                            </div>
                            <h4 className="text-primary text-uppercase mb-3">Patient Information: </h4>
                            <hr className="my-1"></hr>
                            <div className="row">
                            <div className="col">
                            <p className="description mt-3">
                                Patient ID
                                <br/>
                                Name
                                <br/>
                                Date of Birth
                            </p>
                            </div>
                            <div className="col">
                            <p className="description mt-3">
                                <strong>
                                {this.state.patientID}
                                <br/>
                                {this.state.first + " " + this.state.last}
                                <br/>
                                {this.state.dob}
                                </strong>
                            </p>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    {/* Render the prescription */}
                    { prescriptions.length ? 
                        <div className="card-body"> {this.displayPrescriptions()} </div>
                        : 
                        <div className="row" style={{ height: '20rem'}}>
                        <div className="col-8 center" style={{ marginTop: 'auto', marginBottom: 'auto'}}>
                            <div className="alert alert-danger" role="alert">
                            <span className="alert-inner--text"><strong>WARNING: </strong> No prescriptions found.</span>
                            </div>
                        </div>
                        </div> }
                    </div>
                </div>
                </section>
                </div>
                : "" }
            </div>
            :
            <Error/> }
            </div>
        );
    }
}

export default withRouter(Patient);
