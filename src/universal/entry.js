/* istanbul ignore file */
import 'core-js/es6/promise'; // For IE 11 support
import React from 'react';
import ReactDOM from 'react-dom';
import ClientApp from './components/App/ClientApp';
import './favicon.ico';

const data = window.__properties;

ReactDOM.hydrate(<ClientApp list={data.list} value={data.value} />, document.getElementById('root'));
