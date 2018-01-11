import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
 
 
ReactDOM.render(
  <App url='https://schlachter.ca/invoices/db'
       pollInterval={2000} />,
  document.getElementById('root')
);
