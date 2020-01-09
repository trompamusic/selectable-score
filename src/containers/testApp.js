import React, { Component } from 'react';
import { connect } from 'react-redux' ;
import SelectableScore from 'selectable-score/dist/selectable-score';

const MEI_URI = "test.mei"
const vrvOptions = { 
  scale: 45,
  adjustPageHeight: 1,
  pageHeight: 2500,
  pageWidth: 2200,
  noFooter: 1,
  unit: 6
}

export default class TestApp extends Component { 
  constructor(props) { 
    super(props);
  }

  render() {
    return(
      <div><p>This is a minimal example demonstrating the use of the TROMPA selectable-score component.</p>
        <SelectableScore uri={ MEI_URI } options={ vrvOptions } />
      </div>
    )
  }
}

  

