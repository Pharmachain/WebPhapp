import React, { Component } from "react";
import axios from "axios";
import Prescription from "../components/Prescription";
import qs from 'qs';
import Error from './Error';

class PrescriptionDispenser extends Component {
    // Initialize the state
    state = {
    dispenserID: 0,
    name: "",
    phone: 0,
    location: "",
    prescriptions: [], // prescriptions are all the prescriptions given a dispenser id
    validDispenser: true //TODO
    };

    // Fetch the prescription on first mount
    componentDidMount() {
        this.getPrescriptions();
        this.getDispenserInfo();
    }

    // Retrieves the items in a prescription from the Express app
    // ex. api/v1/prescriptions/01
    getPrescriptions = () => {
        // Gets parameter from the URL of 'ID'
        const querystring = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
        const dispenserID = querystring.ID;
        const id = this.props.id;
        this.setState({dispenserID: dispenserID});
        if (dispenserID !== id) {
            this.setState({validDispenser: false})
        }

        axios
            .get(`api/v1/dispensers/prescriptions/open/${dispenserID}`)
            .then(results => results.data)
            .then(prescriptions => this.setState({ prescriptions }));
        };

    // Retrieves the patient information from the Express app
    // ex. api/v1/patients/1
    getDispenserInfo = () => {
        // Gets parameter from the URL of 'ID'
        const querystring = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
        const dispenserID = querystring.ID;
        
        axios
            .get(`api/v1/dispensers/single/${dispenserID}`)
            .then(results => results.data)
            .then(dispenserInfo => this.setState({ name: dispenserInfo['name'], phone: dispenserInfo['phone'], location: dispenserInfo['location'] }));
    }

    // Filters the prescriptions based on onClick of 'open', 'historical', or 'all' tab
    onClickFilterPrescription = (event) => {
        var mode = event.target.id || event.currentTarget.id;       
        // 1 refers to the id of the 'open' tab  
        if (mode === "1") {
        axios
            // open are all the prescriptions that are open given a dispenser id
            .get(`api/v1/dispensers/prescriptions/open/${this.state.dispenserID}`)
            .then(results => results.data)
            .then(prescriptions => this.setState({ prescriptions}));
        } 
        // 2 refers to the id of the 'historical' tab  
        else if (mode === "2") {
        axios
            // historical are the prescriptions that are historical given a dispenser id
            .get(`api/v1/dispensers/prescriptions/historical/${this.state.dispenserID}`)
            .then(results => results.data)
            .then(prescriptions => this.setState({ prescriptions}));
        }
        // 3 refers to the id of the 'all' tab 
        else if (mode === "3") {
        axios
            // all are all the prescriptions given a dispenser id
            .get(`api/v1/dispensers/prescriptions/all/${this.state.dispenserID}`)
            .then(results => results.data)
            .then(prescriptions => this.setState({ prescriptions}));
        }
    }

    // displayPrescriptions() displays the properties of a prescription using Prescription
    // @return: returns all prescriptions for a patient id
    displayPrescriptions = () => {
    const prescriptions = this.state.prescriptions;
    return(
        <div className="col-xl-12 order-xl-1 center">
        <div className="card bg-secondary shadow">
        
            <div className="card-header bg-white border-0">
                <div className="row align-items-center">
                <div className="col-8 text-left">
                    <h3 className="mb-0">{this.state.name}'s Prescriptions</h3>
                </div>
                </div>
                <br/>
                <div className="col-lg-6">
                    <div className="card-body py-2">
                    <div className="icon icon-shape icon-shape-warning rounded-circle mb-4">
                        <i className="fas fa-hospital"></i>
                    </div>
                    <h4 className="text-warning text-uppercase">Dispenser Information: </h4>
                    <hr className="my-1"></hr>
                    <div className="row">
                    <div className="col">
                    <p className="description mt-3">
                        Dispenser ID
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
                        {this.state.dispenserID}
                        <br/>
                        {this.state.name}
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
            {prescriptions.length ? 
            <div className="card-body">
            <div className="nav-wrapper">
                <ul className="nav nav-tabs nav-justified flex-column flex-md-row justify-content-center" id="prescription" role="tablist">
                    <li className="nav-item">
                        <a 
                            className="nav-link mb-sm-3 mb-md-0 active"
                            id="1" 
                            onClick={this.onClickFilterPrescription}
                            data-toggle="tab" 
                            href="#prescription-open" 
                            role="tab" 
                            aria-controls="prescription-tab-open" 
                            aria-selected="true">
                            <i className="fas fa-clipboard-check"></i> 
                            &nbsp;: Open
                        </a>
                    </li>
                    <li className="nav-item">
                        <a 
                            className="nav-link mb-sm-3 mb-md-0" 
                            id="2" 
                            onClick={this.onClickFilterPrescription}
                            data-toggle="tab"
                            href="#prescription-historical" 
                            role="tab" 
                            aria-controls="prescription-tab-historical" 
                            aria-selected="false">
                            <i className="fas fa-history"></i> 
                            &nbsp;: Historical
                        </a>
                    </li>
                    <li className="nav-item">
                        <a 
                            className="nav-link mb-sm-3 mb-md-0" 
                            id="3" 
                            onClick={this.onClickFilterPrescription}
                            data-toggle="tab" 
                            href="#prescription-all" 
                            role="tab" 
                            aria-controls="prescription-tab-all" 
                            aria-selected="false">
                            <i className="fas fa-globe-americas"></i> 
                            &nbsp;: All
                        </a>
                    </li>
                </ul>
            </div>

            <div className="card-body">
                <div className="tab-content">
                    <div className="tab-pane fade show active" id="1" role="tabpanel" aria-labelledby="prescription-tab-open">
                    <Prescription
                        prescriptions = {this.state.prescriptions}
                        role = {this.props.role}
                    />
                    </div>
                </div>
            </div>
            
            </div>
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
        )
    }

    render() {
        // User role from log in
        const user = this.props.role; 
            return (
            <div>
            {(user === 'Dispenser' && this.state.validDispenser) || user === 'Government' || user === 'Admin' ?
                <div>
                {/* Check to see if any prescriptions are found*/}
                <div>
                <div className="bg-gradient-primary py-7 py-xl-8 b-10"></div>
                    <section className="section section-lg pt-lg-0 mt--200 m-5">
                    <div>
                    {/* Render the prescription */}
                    {this.displayPrescriptions()}
                    </div>
                    </section>
                </div>
                </div>
            : <Error/> }
            </div>
            );
        }
    };

export default PrescriptionDispenser;
