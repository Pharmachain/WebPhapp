import React from 'react';

export class Footer extends React.Component {
  render(){
    return(
        // Returns a footer styled according to the Argon style system
        <div className="App">
        {/* Footer */}
        <footer className="py-3" style={{ position: 'relative', zIndex: '-1'}}>
          <div className="container p-5">
            <div className="row align-items-center justify-content-xl-between">
              <div className="col-xl-6">
                <div className="copyright text-center text-xl-left text-muted">
                    © 2019 <span className="font-weight-bold ml-1">Pharmachain</span>
                </div>
              </div>
              <div className="col-xl-6">
                <ul className="nav nav-footer justify-content-center justify-content-xl-end">
                  <li className="nav-item">
                    <a href="https://www.gonzaga.edu/school-of-engineering-applied-science/student-experiences/cede/senior-design-projects/cpsc#CPSC 03, ENSC 55" className="nav-link" target="_blank" rel="noopener noreferrer"><i className="fas fa-user-friends">&nbsp;</i>About Us</a>
                  </li>
                  <li className="nav-item">
                    <a href="https://github.com/Pharmachain/WebPhapp" className="nav-link" target="_blank" rel="noopener noreferrer"><i className="fab fa-github">&nbsp;</i>Github</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
        </div>
    );
  }
}

export default Footer;
