
import React from 'react';

export class Header extends React.Component {
  render(){
    return(
        // Returns a navigation bar styled according to the Argon style system
        <div className="form-group">
          <nav className="navbar navbar-horizontal navbar-expand-lg navbar-dark bg-primary">
            <div className="container">
                <a className="navbar-brand" href="./">PharmaChain EPS</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-default" aria-controls="navbar-default" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbar-default">
                    <div className="navbar-collapse-header">
                      <div className="row">
                          <div className="col-6 collapse-brand">
                              <a href="../../index.html">
                                  {/* <img src="../../../public/assets/img/brand/blue.png"/> */}
                              </a>
                          </div>
                          <div className="col-6 collapse-close">
                              <button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#navbar-default" aria-controls="navbar-default" aria-expanded="false" aria-label="Toggle navigation">
                                  <span></span>
                                  <span></span>
                              </button>
                          </div>
                      </div>
                    </div>
                    <ul className="navbar-nav ml-lg-auto">
                        <li className="nav-item">
                            <a className="nav-link nav-link-icon" href="./patientSearch">
                                <i className="fas fa-search"></i>
                                <span className="nav-link-inner--text d-lg-none">Search</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link nav-link-icon" href="./">
                                <i className="fas fa-home"></i>
                                <span className="nav-link-inner--text d-lg-none">Home</span>
                            </a>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link nav-link-icon" href="#" id="navbar-default_dropdown_1" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="ni ni-settings-gear-65"></i>
                                <span className="nav-link-inner--text d-lg-none">Settings</span>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbar-default_dropdown_1">
                                <a className="dropdown-item" href="#">Action</a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="#">Something else here</a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
      </div>
  );
  }
}

export default Header;
