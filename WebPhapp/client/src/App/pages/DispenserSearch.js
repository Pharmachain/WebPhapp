import React, { Component } from "react";
import axios from "axios";
import DispenserTable from '../components/DispenserTable'
import Error from './Error';

class DispenserSearch extends Component {
  // Initialize the state
  state = {
    dispensers: [],
    dispenserID: "",
    name: ""
  };

  componentDidMount() {
    // const user = this.props.role;
    // // Loads all dispensers by default
    // if(user === 'Government' || user === 'Admin'){
    //     return;
    // }

    axios
      .get(`/api/v1/dispensers/all`)
      .then(results => results.data)
      .then(dispensers => this.setState({ dispensers }));
  }

  // Updating text in the dispenser id state
  onKeyDownDispenserID = event => {
    this.setState({dispenserID: String(event.target.value)});
  }
  
  // Updating text in the dispenser name state
  onKeyDownDispenserName = event => {
    this.setState({name: String(event.target.value)});
  }

  // Search query for dispenser lookup via id and names
  onSearchDispensers = e => {
    e.preventDefault()
    const dispenserID = this.state.dispenserID;
    const name = this.state.name;

    // String interpolation
    var idSearchQuery = `api/v1/dispensers/single/${dispenserID}`;
    var nameSearchQuery = `/api/v1/dispensers?name=${name}`;
    var defaultQuery = `/api/v1/dispensers/all`;

    if (dispenserID) {
      axios
      .get(idSearchQuery)
      .then(results => results.data)
      .then(dispensers => this.setState({ dispensers: [dispensers] }));
    }

    else if (name) {
      axios
      .get(nameSearchQuery)
      .then(results => results.data)
      .then(dispensers => this.setState({ dispensers }));
    }

    else {
      axios
      .get(defaultQuery)
      .then(results => results.data)
      .then(dispensers => this.setState({ dispensers }));
    }
  }

  render() {
    // User role from log in
    const user = this.props.role; 
    return (
      <div>
      {user === 'Government' || user === 'Admin' ?
      <div>
      <div className="bg-gradient-orange py-7 py-xl-8 b-10"></div>
      <section className="section section-lg pt-lg-0 mt--200 m-5">

      <div className="col-xl-8 order-xl-1 center">
        <div className="card bg-secondary shadow">
          <div className="card-header bg-white border-0">
            <div className="row align-items-center">
              <div className="col-8 text-left">
                <h3 className="mb-0">Dispenser Search</h3>
              </div>
            </div>
          </div>
          <div className="card-body text-left">
          <div className="form-group">
          <form onSubmit={this.onSearchDispensers}>
            <div className="form-group mb-3">
                <div className="input-group input-group-alternative">
                  <div className="input-group-prepend">
                    <span className="input-group-text"></span>
                  </div>
                  <input
                    className="form-control"
                    id="dispenser_id"
                    placeholder="Dispenser ID"
                    type="text"
                    value={this.state.dispenserID}
                    onChange={this.onKeyDownDispenserID}
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
                    id="name"
                    placeholder="Name"
                    type="p"
                    value={this.state.name}
                    onChange={this.onKeyDownDispenserName}
                  />
                </div>
              </div>
              <div className="text-center">
                <button type="submit" id="patient_search_button" className="btn btn-icon btn-3 btn-warning">
                  <span className="btn-inner--icon"><i className="fas fa-search"></i></span>
                  <span className="btn-inner--text">Search</span>
                </button>
              </div>
          </form>
          <br/>
          <DispenserTable dispenserList={this.state.dispensers}/>
          </div>
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

export default DispenserSearch;
