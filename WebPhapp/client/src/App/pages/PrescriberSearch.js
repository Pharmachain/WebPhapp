import React, { Component } from "react";
import axios from "axios";
import PrescriberTable from '../components/PrescriberTable'
import Error from './Error';

class PrescriberSearch extends Component {
  // Initialize the state
  state = {
    prescribers: [],
    prescriberID: "",
    firstName: "",
    lastName: ""
  };

  componentDidMount() {
    // const user = this.props.role;
    // // Loads all prescribers by default
    // if(user === 'Government' || user === 'Admin'){
    //     return;
    // }

    axios
      .get(`/api/v1/prescribers/all`)
      .then(results => results.data)
      .then(prescribers => this.setState({ prescribers }));
  }

  // Updating text in the prescriber id state
  onKeyDownPrescriberID = event => {
    this.setState({prescriberID: String(event.target.value)});
  }
  
  // Updating text in the first name state
  onKeyDownFirstName = event => {
    this.setState({firstName: event.target.value});
  }

  // Updating text in the last name state
  onKeyDownLastName = event => {
    this.setState({lastName: event.target.value});
  }


  // Search query for prescriber lookup via id and names
  onSearchPrescribers = e => {
    e.preventDefault()
    const prescriberID = this.state.prescriberID;
    const firstName = this.state.firstName;
    const lastName = this.state.lastName;

    // String interpolation
    var idSearchQuery = `api/v1/prescribers/single/${prescriberID}`;
    var nameSearchQuery = `/api/v1/prescribers?first=${firstName}&last=${lastName}`;
    var defaultQuery = `/api/v1/prescribers/all`;

    if (prescriberID) {
      axios
      .get(idSearchQuery)
      .then(results => results.data)
      .then(prescribers => this.setState({ prescribers: [prescribers] }));
    }

    else if (firstName) {
      axios
      .get(nameSearchQuery)
      .then(results => results.data)
      .then(prescribers => this.setState({ prescribers }));
    }

    else if (lastName) {
        axios
        .get(nameSearchQuery)
        .then(results => results.data)
        .then(prescribers => this.setState({ prescribers }));
      }

    else {
      axios
      .get(defaultQuery)
      .then(results => results.data)
      .then(prescribers => this.setState({ prescribers }));
    }
  }

  render() {
    // User role from log in
    const user = this.props.role; 
    return (
      <div>
      {user === 'Government' || user === 'Admin' ?
      <div className="col-xl-8 order-xl-1 center">
        <div className="card bg-secondary shadow">
          <div className="card-header bg-white border-0">
            <div className="row align-items-center">
              <div className="col-8 text-left">
                <h3 className="mb-0">Prescriber Search</h3>
              </div>
            </div>
          </div>
          <div className="card-body text-left">
          <div className="form-group">
          <form onSubmit={this.onSearchPrescribers}>
            <div className="form-group mb-3">
                <div className="input-group input-group-alternative">
                  <div className="input-group-prepend">
                    <span className="input-group-text"></span>
                  </div>
                  <input
                    className="form-control"
                    id="prescriber_id"
                    placeholder="Prescriber ID"
                    type="text"
                    value={this.state.prescriberID}
                    onChange={this.onKeyDownPrescriberID}
                  />
                </div>
              </div>
              <hr className="my-4"></hr>
              <div className="form-group">
              <div className="input-group input-group-alternative">
                <div className="input-group-prepend">
                  <span className="input-group-text"></span>
                </div>
                <input
                  className="form-control"
                  id="first_name"
                  placeholder="First Name"
                  type="p"
                  value={this.state.firstName}
                  onChange={this.onKeyDownFirstName}
                />
              </div>
            </div>
            <div className="form-group">
              <div className="input-group input-group-alternative">
                <div className="input-group-prepend">
                  <span className="input-group-text"></span>
                </div>
                <input
                  className="form-control"
                  id="last_name"
                  placeholder="Last Name"
                  type="p"
                  value={this.state.lastName}
                  onChange={this.onKeyDownLastName}
                />
              </div>
            </div>
              <div className="text-center">
                <button type="submit" id="patient_search_button" className="btn btn-icon btn-3 btn-success">
                  <span className="btn-inner--icon"><i className="fas fa-search"></i></span>
                  <span className="btn-inner--text">Search</span>
                </button>
              </div>
          </form>
          <br/>
          <PrescriberTable prescriberList={this.state.prescribers}/>
          </div>
          </div>
        </div>
      </div>
      :
      <Error/> }
      </div>
    );
  }
}

export default PrescriberSearch;
