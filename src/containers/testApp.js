import React, { Component } from 'react';
import { connect } from 'react-redux' ;
import Score from 'selectable-score/dist/score'

const MEI_URI = "test.mei"
const vrvOptions = { 
  scale: 45,
  adjustPageHeight: 1,
  pageHeight: 2500,
  pageWidth: 2200,
  noFooter: 1,
  unit: 6
}

class TestApp extends Component { 
  constructor(props) { 
    super(props);
  }
  render() {
    <div>This is a minimal example demonstrating the use of the TROMPA selectableScore component.
      <SelectableScore uri={ MEI_URI } options={ vrvOptions } />
    </div>
  }
}

  

