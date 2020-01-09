import React, { Component }  from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import TestApp from './containers/testApp';

ReactDOM.render(
	<Provider> 
    <TestApp />
	</Provider>, document.querySelector('.container')
);
