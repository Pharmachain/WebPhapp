import React from 'react';
import axios from "axios";

export class Header extends React.Component {

  logout = (e) => {
    axios
    .get(`/api/v1/users/logout`)
    .then( () => {
        window.location.href = './login';
    }); 
  }  
  render(){
    const user = this.props.role;
    const id = this.props.id;
    return(
        // Returns a navigation bar styled according to the Argon style system
        <nav className="navbar navbar-vertical fixed-left navbar-expand-md navbar-light bg-white" id="sidenav-main">
            <div className="container-fluid">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#sidenav-collapse-main" aria-controls="sidenav-main" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <a className="navbar-brand m-0 p-0"  href="./">
                <img src="./assets/img/brand/pharmachain-blue.png" className="navbar-brand-img" alt="Pharmachain"/>
            </a>
            <ul className="nav align-items-center d-md-none"></ul>
            <div className="collapse navbar-collapse" id="sidenav-collapse-main">
                {/* <!-- Collapse header --> */}
                <div className="navbar-collapse-header d-md-none">
                <div className="row">
                    <div className="col-6 collapse-brand">
                    <a href="./">
                        <img src="./assets/img/brand/pharmachain-blue.png" alt="Pharmachain"/>
                    </a>
                    </div>
                    <div className="col-6 collapse-close">
                    <button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#sidenav-collapse-main" aria-controls="sidenav-main" aria-expanded="false" aria-label="Toggle sidenav">
                        <span></span>
                        <span></span>
                    </button>
                    </div>
                </div>
                </div>
                {/* <!-- Navigation --> */}
                {user === 'Patient' ?
                <div>
                <ul className="navbar-nav">
                <li className="nav-item">
                    <a className="nav-link" href={"/patient?ID=" + id}>
                    <i className="fas fa-prescription-bottle text-blue" alt="My Prescriptions"></i> My Prescriptions
                    </a>
                </li>
                </ul>
                <hr className="my-3"/>
                <ul className="navbar-nav mb-md-3">
                <li className="nav-item">
                    <a className="nav-link" href={"./"}>
                    <i className="fas fa-home text" alt="Home"></i> Home
                    </a>
                </li>
                <li className="nav-item" style={{ cursor: "pointer" }}>
                    <span className="nav-link" onClick={this.logout}>
                    <i className="fas fa-door-open"></i> Logout
                    </span>
                </li>
                </ul>
                </div>
                :
                user === 'Prescriber' ?
                <div>
                <ul className="navbar-nav">
                <li className="nav-item">
                    <a className="nav-link" href={"/patientSearch"}>
                    <i className="fas fa-user text-blue" alt="Patient Search"></i> Patient Search
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href={"./prescriptionAdd"}>
                    <i className="fas fa-folder-plus text-success" alt="Add Prescription"></i> Add Prescription
                    </a>
                </li>
                </ul>
                <hr className="my-3"/>
                <ul className="navbar-nav mb-md-3">
                <li className="nav-item">
                    <a className="nav-link" href={"./"}>
                    <i className="fas fa-home text" alt="Home"></i> Home
                    </a>
                </li>
                <li className="nav-item" style={{ cursor: "pointer" }}>
                    <span className="nav-link" onClick={this.logout}>
                    <i className="fas fa-door-open"></i> Logout
                    </span>
                </li>
                </ul>
                </div>
                : 
                user === 'Dispenser' ?
                <div>
                <ul className="navbar-nav">
                <li className="nav-item">
                    <a className="nav-link" href={"/patientSearch"}>
                    <i className="fas fa-user text-blue" alt="Patient Search"></i> Patient Search
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href={"/dispenser?ID=" + id}>
                    <i className="fas fa-mortar-pestle text-orange" alt="View Prescriptions"></i> View Prescriptions
                    </a>
                </li>
                </ul>
                <hr className="my-3"/>
                <ul className="navbar-nav mb-md-3">
                <li className="nav-item">
                    <a className="nav-link" href={"./"}>
                    <i className="fas fa-home text" alt="Home"></i> Home
                    </a>
                </li>
                <li className="nav-item" style={{ cursor: "pointer" }}>
                    <span className="nav-link" onClick={this.logout}>
                    <i className="fas fa-door-open"></i> Logout
                    </span>
                </li>
                </ul>
                </div>
                :
                user === 'Government' ?
                <div>
                <ul className="navbar-nav">
                <li className="nav-item">
                    <a className="nav-link" href={"/patientSearch"}>
                    <i className="fas fa-user text-blue" alt="Patient Search"></i> Patient Search
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href={"/dispenserSearch"}>
                    <i className="fas fa-hospital-alt text-orange" alt="Dispenser Search"></i> Dispenser Search
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href={"/prescriberSearch"}>
                    <i className="fas fa-user-md text-success" alt="Prescriber Search"></i> Prescriber Search
                    </a>
                </li>
                </ul>
                <hr className="my-3"/>
                <ul className="navbar-nav mb-md-3">
                <li className="nav-item">
                    <a className="nav-link" href={"./"}>
                    <i className="fas fa-home text" alt="Home"></i> Home
                    </a>
                </li>
                <li className="nav-item" style={{ cursor: "pointer" }}>
                    <span className="nav-link" onClick={this.logout}>
                    <i className="fas fa-door-open"></i> Logout
                    </span>
                </li>
                </ul>
                </div>
                : "" }
            </div>
            </div>
        </nav>
  );
  }
}

export default Header;
