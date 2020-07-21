import React, { Component } from 'react';
import { connect } from 'react-redux' ;
import Score from 'meld-clients-core/lib/containers/score';
import DragSelect from "dragselect/dist/DragSelect";
import ReactDOM from 'react-dom';
import auth from 'solid-auth-client';

const CONTAINS = "http://www.w3.org/ns/ldp#contains"

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
        : defaultSelectorString,
      scoreComponentLoaded: false,
      updateAnnotationContainer: this.props.updateAnnotationContainer || false,
      annotationContainerContentToRetrieve = new Set(),
      annotationContainerContentItems = {} 

    }
    this.enableSelector = this.enableSelector.bind(this);
    this.scoreComponent = React.createRef();
    this.handleScoreUpdate = this.handleScoreUpdate.bind(this);
    this.observer = new MutationObserver(this.handleScoreUpdate); 
  }

  handleScoreUpdate() { 
    this.props.onScoreUpdate (
      ReactDOM.findDOMNode(this.scoreComponent.current).querySelector("svg")
    );
  }

  enableSelector() {
    if(!Object.keys(this.props.score.SVG).length) {
      console.log("Enable selector called before MEI has loaded!");
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

  fetchAnnotationContainer() { 
    auth.fetch(this.props.annotationContainerUri, {
      mode: 'cors',
      headers: { 'Accept': 'application/ld+json' }
    })
    .then( response => response.json())
    .then( (data) => { 
      // fetch any contents of the container
      let uri = annotationContainerUri;
      // ensure uri ends with slash
      uri = uri.charAt(uri.length-1) === "/" ? uri : uri + "/"
      // find json-ld description of the container itself
      const container = data.filter( x => x["@id"] === uri )[0]
      if(container.includes(CONTAINS)) { 
        const containerUris = new Set(
          container.CONTAINS.map( contentItem => contentItem["@id"] )
        )
        this.setState({ annotationContainerContentToRetrieve: contentUris }, 
          this.fetchAnnotationContainerContent()
        )
      } else { this.props.onReceiveAnnotationContainerContent({}) }; // report empty container
    })
    .catch( err => console.log("Error: ", err))
  }

  fetchAnnotationContainerContent() { 
    this.state.annotationContainerContentToRetrieve.forEach((uri) => { 
      this.setState({ annotationContainerContentToRetrieve: this.state.annotationContainerContentToRetrieve.delete(uri) }, 
        auth.fetch(uri, {
          mode: 'cors',
          headers: { 'Accept': 'application/ld+json' }
        })
        .then( response => response.json())
        .then( (data) => { 
          this.setState({ annotationContainerContentItems: 
            ...this.state.annotationContainerContentItems, [uri]: data  // immutable update
          })
        



  
  componentDidMount() { 
    // horrible hack to allow SVG to be loaded into DOM first
    // TODO fix using Mutation Observers
    setTimeout(() => {
      this.enableSelector();
    }, 1000)

  }

  componentDidUpdate(prevProps, prevState) {
    // handle fetching of annotation container contents
    if(this.props.annotationContainerUri && this.state.updateAnnotationContainer) { 
      console.log("Fetching anno container", this.props.annotationContainerUri);
      if(this.props.onReceiveAnnotationContainerContent) { 
        this.fetchAnnotationContainer()
      } else { 
        console.error("Specified annotation container URI without onReceiveAnnotationContainerContent callback");
      }
    }
    if(!prevState.scoreComponentLoaded && this.scoreComponent.current) { 
      // first load of score component - start observing for DOM changes
      this.setState({ "scoreComponentLoaded": true }, () => { 
        this.observer.observe(ReactDOM.findDOMNode(this.scoreComponent.current).querySelector(".score"), {"childList": true});
      })
    }
    if(prevProps.score.latestRenderedPageNum !== this.props.score.latestRenderedPageNum) { 
      // page turned, re-initialise selectors 
        this.enableSelector();
    }
    if(prevProps.selectorString !== this.props.selectorString) { 
      // selector changed (e.g. from .note to .measure), re-initialise selectors
        this.setState({"selectorString": this.props.selectorString}, () => {
          this.enableSelector();
        });
    }
  }

  render() { 
    console.log("Attempting to render score with uri: ", this.props.uri);
    return(
      <Score 
        uri={ this.props.uri }
        key={ this.props.uri }
        options={ this.state.vrvOptions }
        ref = { this.scoreComponent }
      />
    )
  }
}

function mapStateToProps({ score }) {
  return { score }
}


export default connect(mapStateToProps,)(SelectableScore);
