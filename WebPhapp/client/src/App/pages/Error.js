import React, { Component } from 'react';

class Error extends Component {
    render() {
        return (
            <div className="section">
            <div className="container justify-content-center text-center">
                <h1 className="display-1 text-warning lead" style={{fontSize: "800%"}}>
                    <span><i className="far fa-frown"></i> 404</span>
                </h1>
                <h5 className="display-4 lead">OOPS! NOTHING WAS FOUND</h5>
                <div className="center col-lg-8">
                    <p>Sorry, but the page you are looking for does not exist, has been removed, or is temporarily unavailable.&nbsp;
                        <a className="text-warning" href="./"><u>Return to home page</u></a>
                        &nbsp;or&nbsp;
                        <a className="text-warning" href="./login"><u>login page</u></a>
                    </p>
                </div>
                </div>
            </div>
        );
    }
}

export default Error;