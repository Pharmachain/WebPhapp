import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './index.css';

// fix #1 here
import App from './App/pages/App';

render((
    <BrowserRouter>
        <App/>
    </BrowserRouter>
), document.getElementById('root'));
