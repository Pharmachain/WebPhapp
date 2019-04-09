import React, { Component } from "react";
import axios from "axios";
import qs from 'qs';
import Prescription from "../components/Prescription";
import Error from "./Error";

class PrescriptionPrescriber extends Component {
    // Initialize the state
    state = {
        prescriberID: 0,
        first: "",
        last: "",
        phone: "",
        location: "",
        prescriptions: [],
        isFetching: true
    };

    // Fetch the prescription on first mount
    componentDidMount() {
        this.getPrescriptions();
        this.getPrescriberInfo();
    }

    // Retrieves the items in a prescription from the Express app
    // ex. api/v1/prescriptions/01
    getPrescriptions = () => {
        // Gets parameter from the URL of 'ID'
        const querystring = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
        const prescriberID = querystring.ID;
        this.setState({prescriberID});

        axios
            // String interpolation.
            .get(`/api/v1/prescribers/prescriptions/${prescriberID}`)
            .then(results => results.data)
            .then(prescriptions => this.setState({ prescriptions, isFetching: false }));
    };

    // Retrieves the items in a prescription from the Express app
    // ex. api/v1/prescriptions/01
    getPrescriberInfo = () => {
        // Gets parameter from the URL of 'ID'
        const querystring = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
        const prescriberID = querystring.ID;

        axios
            // String interpolation.
            .get(`/api/v1/prescribers/single/${prescriberID}`)
            .then(results => results.data)
            .then(prescriberInfo => this.setState({ first: prescriberInfo['first'], last: prescriberInfo['last'], phone: prescriberInfo['phone'], location: prescriberInfo['location'] }));
    };

    // displayPrescriptions() displays the properties of a prescription using Prescription
    // @return: returns all prescriptions for a prescriber id
    displayPrescriptions = () => {
    return(
        <Prescription
        prescriptions = {this.state.prescriptions}
        getPrescriptions = {this.getPrescriptions}
        role = {this.props.role}
        />
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
            {user === 'Government' || user === 'Admin' ?
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
                            <h3 className="mb-0">{this.state.first}'s Prescriptions</h3>
                        </div>
                        </div>
                        <br/>
                        <div className="col-lg-6">
                            <div className="card-body py-2">
                            <div className="icon icon-shape icon-shape-success rounded-circle mb-4">
                                <i className="fas fa-user-md"></i>
                            </div>
                            <h4 className="text-success text-uppercase">Prescriber Information: </h4>
                            <hr className="my-1"></hr>
                            <div className="row">
                            <div className="col">
                            <p className="description mt-3">
                                Prescriber ID
                                <br/>
                                Name
                                <br/>
                                Phone
                                <br/>
                                Location
                            </p>
                            </div>
                            <div className="col">
                            <p className="description mt-3">
                                <strong>
                                {this.state.prescriberID}
                                <br/>
                                {this.state.first + " " + this.state.last}
                                <br/>
                                {this.state.phone}
                                <br/>
                                {this.state.location}
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

export default PrescriptionPrescriber;
