import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import config from '../config';
var app_url = config.opt.full_url + '/db';

ReactDOM.render(
  <App url= {app_url}
       pollInterval={2000} />,
  document.getElementById('root')
);
