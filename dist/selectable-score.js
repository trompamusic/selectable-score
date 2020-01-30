import React, { Component } from 'react';
import { connect } from 'react-redux' ;
import Score from 'meld-clients-core/src/containers/score';
import DragSelect from "dragselect/dist/DragSelect";

const defaultVrvOptions = {
  scale: 45,
  adjustPageHeight: 1,
  pageHeight: 2500,
  pageWidth: 2200,
  footer: "none",
  unit: 6
}

const defaultSelectorString = '.note'; 

class SelectableScore extends Component {
  constructor(props) { 
    super(props);
    this.state = { 
      vrvOptions: "vrvOptions" in this.props 
        ? this.props.vrvOptions 
        : defaultVrvOptions,
      selectorString: "selectorString" in this.props 
        ? this.props.selectorString
        : defaultSelectorString
    }
    this.enableSelector = this.enableSelector.bind(this);
  }

  enableSelector() {
    if(!Object.keys(this.props.score.SVG).length) {
      console.log("Doh!");
      return; // no MEI loaded yet
    }
    if (typeof this.state.selector !== "undefined") {
      this.state.selector.stop();
    }
    let selector = new DragSelect({
      selectables: document.querySelectorAll(this.state.selectorString),
      area: document.getElementsByClassName('score')[0],
      selectedClass: 'selected',
      onDragStartBegin: () => {
        document.body.classList.add('s-noselect');
      },
      callback: (elements) => {
        document.body.classList.remove('s-noselect');
        this.props.onSelectionChange(elements);
      }
    });
    this.setState({selector: selector});
  }
  
  componentDidMount() { 
    // horrible hack to allow SVG to be loaded into DOM first
    setTimeout(() => {
      this.enableSelector();
    }, 1000)
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.score.latestRenderedPageNum !== this.props.score.latestRenderedPageNum) { 
      // page turned, re-initialise selectors 
        this.enableSelector();
    }
  }

  render() { 
    return(
      React.createElement(
        'Score',
        { 
          uri:  this.props.uri,  
          key:  this.props.uri, 
          options: this.state.vrvOptions 
        }
      )
    )
  }
}

function mapStateToProps({ score }) {
  return { score }
}


export default connect(mapStateToProps,)(SelectableScore);
