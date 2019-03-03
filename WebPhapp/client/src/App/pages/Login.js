import React, { Component } from "react";

class Login extends Component {
    // Initialize the state
    state = {
        userID: "",
        password: ""
    };

    // Updating value in userID state
    onKeyDownUserID = event => {
        this.setState({userID: event.target.value});
    }

    // Updating value in password state
    onKeyDownPassword = event => {
        this.setState({password: event.target.value});
    }

    render() {
        return(
          <div className="App">
            {/* Pharmachain Login Header */}
            <div class="header bg-gradient-primary py-7 py-lg-8">
              <div class="container">
                <div class="header-body text-center mb-7">
                  <div class="row justify-content-center">
                    <div class="col-lg-5 col-md-6">
                      <h1 class="text-white">Welcome to Pharamachain!</h1>
                      <p class="text-lead text-light">Login to your account below.</p>
                    </div>
                  </div>
                </div>
              </div>
            


            {/* Pharmachain Login Card */}
            <div class="container mt--8 pb-5">
            <div class="row justify-content-center">
              <div class="col-lg-5 col-md-7">
                <div class="card bg-secondary shadow border-0">
                  <div class="card-header bg-transparent pb-5">
                    <div class="text-muted text-center mt-2 mb-3"><small>Sign in with</small></div>
                    <div class="btn-wrapper text-center">
                      <a href="#" class="btn btn-neutral btn-icon">
                        <span class="btn-inner--icon"><img src="../assets/img/icons/common/github.svg"/></span>
                        <span class="btn-inner--text">Github</span>
                      </a>
                      <a href="#" class="btn btn-neutral btn-icon">
                        <span class="btn-inner--icon"><img src="../assets/img/icons/common/google.svg"/></span>
                        <span class="btn-inner--text">Google</span>
                      </a>
                    </div>
                  </div>
                  <div class="card-body px-lg-5 py-lg-5">
                    <div class="text-center text-muted mb-4">
                      <small>Sign in with credentials</small>
                    </div>
                    <form role="form">
                      <div class="form-group mb-3">
                        <div class="input-group input-group-alternative">
                          <div class="input-group-prepend">
                            <span class="input-group-text"><i class="ni ni-email-83"></i></span>
                          </div>
                          <input class="form-control" placeholder="Email" type="email"/>
                        </div>
                      </div>
                      <div class="form-group">
                        <div class="input-group input-group-alternative">
                          <div class="input-group-prepend">
                            <span class="input-group-text"><i class="ni ni-lock-circle-open"></i></span>
                          </div>
                          <input class="form-control" placeholder="Password" type="password"/>
                        </div>
                      </div>
                      <div class="custom-control custom-control-alternative custom-checkbox">
                        <input class="custom-control-input" id=" customCheckLogin" type="checkbox"/>
                        <label class="custom-control-label" for=" customCheckLogin">
                          <span class="text-muted">Remember me</span>
                        </label>
                      </div>
                      <div class="text-center">
                        <button type="button" class="btn btn-primary my-4">Sign in</button>
                      </div>
                    </form>
                  </div>

                
                <div class="row mt-3">
                  <div class="col-6">
                    <a href="#" class="text-light"><small>Forgot password?</small></a>
                  </div>
                  <div class="col-6 text-right">
                    <a href="#" class="text-light"><small>Create new account</small></a>
                  </div>
                </div>




                
              </div>
            </div>
            </div>
          </div>
            








            </div>
          </div>
        );
    }


}

export default Login;