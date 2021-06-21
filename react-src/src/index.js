import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'

import 'semantic-ui-css/semantic.min.css';
import './index.css';

import App from './components/App/App';
import Client from './components/Client/Client';
import registerServiceWorker from './registerServiceWorker';

const routing = (
    <Router>
        <div>
            <Route exact path="/" component={App} />
            <Route path="/client/:clientId" component={Client} />
        </div>
    </Router>
)

ReactDOM.render(routing, document.getElementById('root'))

registerServiceWorker();
