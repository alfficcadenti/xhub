/* istanbul ignore file */
import 'core-js/es6/promise'; // For IE 11 support
import React from 'react';
import ReactDOM from 'react-dom';
import ClientApp from './components/App/ClientApp';
import './favicon.ico';

ReactDOM.render(<ClientApp />, document.getElementById('root'));
