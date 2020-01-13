import React, { Component } from 'react';
import SelectableScore from 'selectable-score/dist/selectable-score';
import NextPageButton from 'selectable-score/dist/next-page-button.js';
import PrevPageButton from 'selectable-score/dist/prev-page-button.js';

// Parameters for SelectableScore component
// ****************************************
// MEI_URI: Can be a full URI, e.g. obtained from the TROMPA Contributor Environment 
const MEI_URI = "test.mei" 
// vrvOptions: If not supplied to <SelectableScore>, will default to predefined options
const vrvOptions = {  //
  scale: 45,
  adjustPageHeight: 1,
  pageHeight: 2500,
  pageWidth: 2200,
  noFooter: 1,
  unit: 6
}
// selectionString: CSS selector for all elements to be selectable (e.g. ".measure", ".note")
const selectorString = ".measure";

export default class TestApp extends Component { 
  constructor(props) { 
    super(props);
    this.state = { 
      selection: []
    };
    this.handleSelectionChange = this.handleSelectionChange.bind(this);
  }

  handleSelectionChange(selection) { 
    this.setState({ selection });
    /* and anything else your app needs to do when the selection changes */
  }

  render() {
    return(
      <div>
        <p>This is a minimal example demonstrating the use of the TROMPA selectable-score component.</p>
        <p>Current selection: { this.state.selection.length > 0
          ? <span> { this.state.selection.map( (elem) => elem.getAttribute("id") ).join(", ") } </span>
          : <span>Nothing selected</span>
        }</p>

        <NextPageButton 
          buttonContent = { <span>Next</span> } 
          uri = { MEI_URI }
        />
        <PrevPageButton 
          buttonContent = { <span>Prev</span>} 
          uri = { MEI_URI }
        />
        <SelectableScore 
          uri={ MEI_URI } 
          options={ vrvOptions } 
          onSelectionChange={ this.handleSelectionChange } 
          selectorString = { selectorString }
          nextPageButton = { this.nextPageButton }
        />
      </div>
    )
  }
}

  

